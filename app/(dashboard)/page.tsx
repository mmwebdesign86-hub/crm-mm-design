import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { addDays, parseISO, isBefore } from 'date-fns';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, CheckCircle, Clock, Plus, User } from 'lucide-react';
import { ClientDialog } from '@/components/clients/client-dialog';

export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Fetch active services ordered by end_date
    const { data: services, error } = await supabase
        .from('services')
        .select(`
            *,
            clients (
                id,
                nombre_fiscal,
                nombre_contacto
            )
        `)
        .eq('status', 'active')
        .order('end_date', { ascending: true });

    if (error) {
        console.error('Error fetching dashboard data:', error);
        return (
            <div className="p-4 text-red-500">
                Error cargando datos: {error.message}
            </div>
        );
    }

    // 2. Group Services by Client
    const clientsMap = new Map();

    services?.forEach(service => {
        const client = service.clients as any;
        if (!client) return;

        if (!clientsMap.has(client.id)) {
            clientsMap.set(client.id, {
                info: client,
                services: []
            });
        }
        clientsMap.get(client.id).services.push(service);
    });

    const clients = Array.from(clientsMap.values());

    const today = new Date();
    const nextWeek = addDays(today, 7);
    const complexLimit = addDays(today, 30);

    return (
        <div className="space-y-8 p-2">

            {/* 1. Header Ferrari Style */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-red-600 drop-shadow-sm uppercase">
                        Dashboard MM Design Web
                    </h1>
                    <p className="text-gray-400 mt-1">Panel de Control de Vencimientos y Clientes</p>
                </div>
                {/* Visual "Quick Create" Trigger (wraps the dialog) */}
                <div className="hidden md:block">
                    <ClientDialog />
                </div>
            </div>

            {/* 2. Grid System */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* Quick Create Card (Visible on mobile/grid flow) */}
                <Card className="bg-[#1a1a1a] border-dashed border-2 border-gray-700 flex flex-col items-center justify-center p-6 hover:border-red-600 transition-colors cursor-pointer group min-h-[300px]">
                    <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                        <Plus className="h-8 w-8 text-gray-400 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-300 group-hover:text-white">Nuevo Cliente</h3>
                    <p className="text-sm text-gray-500 text-center mt-2 mb-4">Registra una nueva empresa en el CRM</p>
                    <div className="w-full">
                        {/* We reuse the dialog component but visually we might want it to fill the card interaction. 
                            For now, we just place the button here as a main action 
                        */}
                        <ClientDialog />
                    </div>
                </Card>

                {/* Client Cards */}
                {clients.map(({ info, services }) => (
                    <Card key={info.id} className="bg-white text-black shadow-xl border-none overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col">

                        {/* Header Image & Name */}
                        <div className="flex flex-row p-6 gap-4 items-center border-b border-gray-100">
                            {/* Placeholder Photo */}
                            <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 shadow-inner">
                                <User className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="overflow-hidden">
                                <h2 className="text-xl font-black text-black uppercase leading-tight truncate">
                                    {info.nombre_fiscal}
                                </h2>
                                <p className="text-sm text-gray-500 truncate">{info.nombre_contacto || 'Sin contacto'}</p>
                            </div>
                        </div>

                        {/* Body: Service List */}
                        <CardContent className="p-6 flex-1 space-y-4">
                            {services.map((service: any) => {
                                const endDate = parseISO(service.end_date);
                                let icon = <CheckCircle className="h-4 w-4 text-green-600" />;
                                let dateClass = "text-gray-600";

                                if (isBefore(endDate, today)) {
                                    icon = <AlertCircle className="h-4 w-4 text-red-600 font-bold" />;
                                    dateClass = "text-red-600 font-bold";
                                } else if (isBefore(endDate, nextWeek)) {
                                    icon = <Clock className="h-4 w-4 text-red-500" />;
                                    dateClass = "text-red-500 font-semibold";
                                } else if (isBefore(endDate, complexLimit)) {
                                    icon = <Calendar className="h-4 w-4 text-yellow-600" />;
                                    dateClass = "text-yellow-600";
                                }

                                return (
                                    <div key={service.id} className="flex items-center justify-between text-sm group/item">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            {icon}
                                            <span className="truncate font-medium text-gray-800" title={service.description || service.type}>
                                                {service.description || service.type}
                                            </span>
                                        </div>
                                        <span className={`whitespace-nowrap ${dateClass}`}>
                                            {format(endDate, 'dd/MM/yyyy', { locale: es })}
                                        </span>
                                    </div>
                                )
                            })}
                        </CardContent>

                        {/* Footer Button Turbo */}
                        <CardFooter className="p-0 mt-auto">
                            <Button
                                className="w-full rounded-none h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-lg tracking-wide shadow-inner"
                                asChild
                            >
                                <Link href={`/clients/${info.id}`}>
                                    IR A FICHA CLIENTE 🚀
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
