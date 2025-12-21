import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { resend } from '@/lib/resend';
import { ExpirationEmailTemplate } from '@/components/emails/expiration-email-template';
import { addDays, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const dynamic = 'force-dynamic'; // Ensure the route is not cached by Next.js

export async function GET(req: NextRequest) {
    try {
        // 0. Security Check
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', { status: 401 });
        }

        // 1. Calculate Date Range (Next 7 days)
        const today = new Date();
        const nextWeek = addDays(today, 7);

        // Format dates for database comparison (YYYY-MM-DD)
        // We want services expiring between NOW and 7 days from now
        const todayStr = today.toISOString().split('T')[0];
        const nextWeekStr = nextWeek.toISOString().split('T')[0];

        console.log(`[CRON] Checking expirations between ${todayStr} and ${nextWeekStr}...`);

        // 2. Query Active Services Expiring Soon
        // utilizing the admin client to bypass RLS
        const { data: expiringServices, error: servicesError } = await supabaseAdmin
            .from('services')
            .select(`
        *,
        clients (
          nombre_fiscal,
          email_contacto,
          nombre_contacto
        )
      `)
            .eq('status', 'active') // Only active services
            .eq('avisos_activos', true) // Only where notifications are enabled
            .lte('end_date', nextWeekStr) // Expiring on or before 7 days
            .gte('end_date', todayStr);   // And not already expired long ago (optional, but good for focus)

        if (servicesError) {
            console.error('[CRON] Error querying services:', servicesError);
            return NextResponse.json({ error: servicesError.message }, { status: 500 });
        }

        if (!expiringServices || expiringServices.length === 0) {
            console.log('[CRON] No expiring services found.');
            return NextResponse.json({ message: 'No expiring services found', count: 0 });
        }

        console.log(`[CRON] Found ${expiringServices.length} potential expiring services.`);

        let emailsSent = 0;
        const errors = [];

        // 3. Process Each Service
        for (const service of expiringServices) {
            try {
                // Safe check for client data presence
                if (!service.clients) {
                    console.warn(`[CRON] Service ${service.id} has no linked client.`);
                    continue;
                }

                // We cast because Query result types can be complex with joins
                const client = service.clients as any;
                const clientEmail = client.email_contacto;
                const clientName = client.nombre_fiscal || 'Cliente estimado';
                const serviceName = service.description || service.type;
                const expirationDate = service.end_date!; // We checked it exists in query

                if (!clientEmail) {
                    console.warn(`[CRON] Client for service ${service.id} has no email.`);
                    continue;
                }

                // 4. Check Duplicate Notifications using notifications_log table
                // We want to avoid sending the same 'EXPIRATION_WARNING' for this service in the last 7 days? 
                // Or simply if one has EVER been sent for this specific end date?
                // Let's check if we sent a notification for this service of type 'EXPIRATION_WARNING' 
                // within the last 15 days (to overlap the 7 day window safely).

                const fifteenDaysAgo = addDays(today, -15).toISOString();

                const { data: logs, error: logError } = await supabaseAdmin
                    .from('notifications_log')
                    .select('*')
                    .eq('service_id', service.id)
                    .eq('tipo_aviso', 'EXPIRATION_WARNING')
                    .gte('created_at', fifteenDaysAgo);

                if (logError) {
                    console.error(`[CRON] Error checking logs for service ${service.id}`, logError);
                    continue;
                }

                if (logs && logs.length > 0) {
                    console.log(`[CRON] Skipped service ${service.id} - Notification already sent.`);
                    continue;
                }

                // 5. Send Email
                const formattedDate = format(parseISO(expirationDate), 'dd/MM/yyyy', { locale: es });

                const { data: emailData, error: emailError } = await resend.emails.send({
                    from: 'onboarding@resend.dev', // WARNING: Change to your verified domain in production
                    to: [clientEmail],
                    subject: `Aviso Importante: Renovación de Servicio - ${clientName}`,
                    react: <ExpirationEmailTemplate
                        clientName={clientName}
                        serviceName={serviceName}
                        expirationDate={formattedDate}
                    />,
                });

                if (emailError) {
                    console.error(`[CRON] Failed to send email for service ${service.id}:`, emailError);
                    errors.push({ serviceId: service.id, error: emailError });
                    continue;
                }

                // 6. Log Notification
                await supabaseAdmin.from('notifications_log').insert({
                    service_id: service.id,
                    tipo_aviso: 'EXPIRATION_WARNING',
                    email_enviado_a: clientEmail,
                    estado_envio: 'enviado',
                    created_at: new Date().toISOString(),
                });

                console.log(`[CRON] Email sent for service ${service.id} to ${clientEmail}`);
                emailsSent++;

            } catch (innerError) {
                console.error(`[CRON] Unexpected error processing service ${service.id}:`, innerError);
                errors.push({ serviceId: service.id, error: innerError });
            }
        }

        return NextResponse.json({
            message: 'Cron job execution completed',
            found: expiringServices.length,
            sent: emailsSent,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('[CRON] Fatal error in cron job:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
