import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ServiceDialog } from '@/components/services/service-dialog'
import { ClientActions } from '@/components/clients/client-actions'
import { ServiceList } from '@/components/services/service-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, MapPin, Building2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    const { id } = await params

    // 1. Fetch Client Info
    const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single()

    if (clientError || !client) {
        notFound()
    }

    // 2. Fetch Client Services
    const { data: services } = await supabase
        .from('services')
        .select('*')
        .eq('client_id', id)
        .order('end_date', { ascending: true })

    return (
        <div className="space-y-8">
            {/* Header & Back */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/clients" className="text-gray-400 hover:text-white">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-white max-w-[600px] truncate">{client.nombre_fiscal}</h1>
                    <ClientActions client={client} />
                </div>
            </div>

            {/* Client Info Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-[#1a1a1a] border-[#333] text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Datos Fiscales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-[#8B0000]" />
                            <span className="font-bold">{client.cif_nif || 'No NIF'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-[#8B0000] mt-1" />
                            <span className="text-sm text-gray-300">
                                {client.direccion}<br />
                                {client.poblacion} {client.codigo_postal}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#1a1a1a] border-[#333] text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Contacto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{client.nombre_contacto}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-[#8B0000]" />
                            <a href={`mailto:${client.email_contacto}`} className="text-sm hover:underline text-gray-300">{client.email_contacto}</a>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-[#8B0000]" />
                            <span className="text-sm text-gray-300">{client.telefono || '-'}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#1a1a1a] border-[#333] text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Notas / Observaciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-[#8B0000] mt-1" />
                            <p className="text-sm text-gray-300 whitespace-pre-wrap">{client.notas || 'Sin notas.'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Services Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Servicios Contratados</h2>
                        <p className="text-gray-400 text-sm">Gestiona los servicios activos y sus vencimientos.</p>
                    </div>
                    <ServiceDialog clientId={client.id} />
                </div>

                <ServiceList services={services || []} />
            </div>
        </div>
    )
}
