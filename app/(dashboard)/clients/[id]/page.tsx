import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ServiceDialog } from '@/components/services/service-dialog'
import { ClientActions } from '@/components/clients/client-actions'
import { ServiceList } from '@/components/services/service-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, MapPin, Building2, FileText, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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

    // Check for overdue services
    const hasOverdueServices = services?.some(service =>
        service.end_date && new Date(service.end_date) < new Date()
    )

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
                    {hasOverdueServices && (
                        <Badge className="bg-red-600 text-white hover:bg-red-700 px-3 py-1 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            PAGOS PENDIENTES
                        </Badge>
                    )}
                    <ClientActions client={client} />
                </div>
            </div>

            {/* Client Info Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-white border-gray-200 text-gray-900 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Datos Fiscales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Building2 className="h-5 w-5 text-[#DC2626]" />
                            <span className="font-bold text-lg">{client.cif_nif || 'No NIF'}</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-[#DC2626] mt-1" />
                            <span className="text-sm text-gray-600">
                                {client.direccion}<br />
                                {client.poblacion} {client.codigo_postal}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 text-gray-900 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Contacto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold">{client.nombre_contacto}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-[#DC2626]" />
                            <a href={`mailto:${client.email_contacto}`} className="text-sm hover:underline text-gray-600 font-medium">{client.email_contacto}</a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-[#DC2626]" />
                            <span className="text-sm text-gray-600">{client.telefono || '-'}</span>
                        </div>
                        {client.mobile_phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-[#DC2626]" />
                                <span className="text-sm text-gray-600">{client.mobile_phone}</span>
                            </div>
                        )}
                        {/* Multi-Web Display */}
                        {client.website_urls && client.website_urls.length > 0 ? (
                            <div className="space-y-1 pt-1 border-t border-gray-100 mt-2">
                                {client.website_urls.map((url: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <Globe className="h-5 w-5 text-[#DC2626]" />
                                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline text-blue-600 truncate max-w-[200px]">
                                            {url}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            client.website_url && (
                                <div className="flex items-center gap-3 pt-1 border-t border-gray-100 mt-2">
                                    <Globe className="h-5 w-5 text-[#DC2626]" />
                                    <a href={client.website_url} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline text-blue-600 truncate max-w-[200px]">
                                        {client.website_url}
                                    </a>
                                </div>
                            )
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 text-gray-900 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Notas / Observaciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-[#DC2626] mt-1" />
                            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{client.notas || 'Sin notas.'}</p>
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
