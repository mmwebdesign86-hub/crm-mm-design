import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { addDays, format, parseISO, isBefore, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';

export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Fetch active services ordered by end_date
    const { data: services, error } = await supabase
        .from('services')
        .select(`
            *,
            clients (
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

    const today = new Date();
    const nextWeek = addDays(today, 7);
    const complexLimit = addDays(today, 30);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>

            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>Próximos Vencimientos de Servicios</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Servicio</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Vencimiento</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!services || services.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No hay servicios activos próximos a vencer.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                services.map((service) => {
                                    const client = service.clients as any;
                                    const endDate = parseISO(service.end_date);

                                    // Traffic Light Logic
                                    // Red: Expired or <= 7 days
                                    // Yellow: > 7 days and <= 30 days
                                    // Green: > 30 days

                                    let badgeColor = "bg-green-500 hover:bg-green-600";
                                    let badgeText = "OK";

                                    if (isBefore(endDate, today)) {
                                        badgeColor = "bg-red-600 hover:bg-red-700";
                                        badgeText = "VENCIDO";
                                    } else if (isBefore(endDate, nextWeek)) {
                                        badgeColor = "bg-red-500 hover:bg-red-600";
                                        badgeText = "CRÍTICO (< 7 días)";
                                    } else if (isBefore(endDate, complexLimit)) {
                                        badgeColor = "bg-yellow-500 hover:bg-yellow-600 text-black";
                                        badgeText = "PRÓXIMO (< 30 días)";
                                    }

                                    return (
                                        <TableRow key={service.id}>
                                            <TableCell className="font-medium">
                                                {client?.nombre_fiscal || 'Sin Cliente'}
                                            </TableCell>
                                            <TableCell>{service.description || service.type}</TableCell>
                                            <TableCell>{service.price} €</TableCell>
                                            <TableCell>
                                                {format(endDate, 'dd/MM/yyyy', { locale: es })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={badgeColor}>
                                                    {badgeText}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
