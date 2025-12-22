import { createClient } from '@/lib/supabase/server'
import { ClientDialog } from '@/components/clients/client-dialog'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Eye, Building2, User, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { ClientActions } from '@/components/clients/client-actions'


export default async function ClientsPage() {
    const supabase = await createClient()
    const { data: clients } = await supabase
        .from('clients')
        .select('*, services(end_date)')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Gestión de Clientes</h2>
                    <p className="text-muted-foreground">Administra tu cartera y consulta el estado de cada cuenta.</p>
                </div>
                <ClientDialog />
            </div>

            <div className="space-y-4">
                {clients?.length === 0 ? (
                    <div className="text-center py-12 border border-[#333] rounded-md text-gray-500">
                        No hay clientes registrados.
                    </div>
                ) : (
                    clients?.map((client) => {
                        // Check for overdue services
                        const hasOverdueServices = client.services?.some((service: any) =>
                            service.end_date && new Date(service.end_date) < new Date()
                        )

                        return (
                            <div key={client.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row items-center gap-6 transition-all hover:shadow-md">
                                {/* LOGO */}
                                <div className="flex-shrink-0">
                                    {client.image_url ? (
                                        <div className="h-20 w-20 rounded-lg border border-gray-100 bg-white p-1 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={client.image_url}
                                                alt={`Logo ${client.trade_name}`}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-20 w-20 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center">
                                            <Building2 className="h-8 w-8 text-gray-300" />
                                        </div>
                                    )}
                                </div>

                                {/* INFO PRINCIPAL */}
                                <div className="flex-grow text-center md:text-left space-y-1 w-full">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {client.trade_name || client.nombre_fiscal}
                                    </h3>

                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <span>{client.nombre_contacto || 'Sin contacto'}</span>
                                        </div>
                                        {client.poblacion && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                <span>{client.poblacion}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ESTADO & ACCIONES */}
                                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                                    {/* Estado Badge */}
                                    <div className="flex-shrink-0">
                                        {hasOverdueServices ? (
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-sm font-bold shadow-sm">
                                                <AlertTriangle className="h-4 w-4" />
                                                PENDIENTE
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-bold shadow-sm">
                                                <CheckCircle2 className="h-4 w-4" />
                                                AL DÍA
                                            </div>
                                        )}
                                    </div>

                                    {/* Botones */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            asChild
                                            className="bg-[#DC2626] hover:bg-red-700 text-white font-medium shadow-sm hover:shadow transition-all"
                                        >
                                            <Link href={`/clients/${client.id}`} className="flex items-center gap-2">
                                                IR A FICHA 🚀
                                            </Link>
                                        </Button>

                                        <div className="text-gray-900">
                                            {/* Wrapper div to force text color ifDropdown inherits wrong color */}
                                            <ClientActions client={client} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
