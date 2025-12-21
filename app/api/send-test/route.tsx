import { ExpirationEmailTemplate } from '@/components/emails/expiration-email-template';
import { resend } from '@/lib/resend';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const targetEmail = 'mmwebdesign86@gmail.com';

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [targetEmail],
      subject: 'Prueba de Sistema de Notificaciones - MM Design Web',
      react: <ExpirationEmailTemplate clientName="Cliente de Prueba" serviceName = "Mantenimiento Premium" expirationDate="25/12/2025" />,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email enviado correctamente', data });
  } catch (error) {
    console.error('Unexpected Error sending email:', error);
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
