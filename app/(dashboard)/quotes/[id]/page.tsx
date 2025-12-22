import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User, Calendar, FileText, MapPin, Mail, Phone, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { QuotePDFButton } from '@/components/quotes/quote-pdf-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function QuoteDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    const { id } = await params

    const { data: quote, error } = await supabase
        .from('quotes')
        .select(`
            *,
            clients (
                *
            )
        `)
        .eq('id', id)
        .single()

    if (error || !quote) {
        notFound()
    }

    const client = quote.clients

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft': return <Badge variant="secondary">Borrador</Badge>
            case 'sent': return <Badge className="bg-blue-600">Enviado</Badge>
            case 'accepted': return <Badge className="bg-green-600">Aceptado</Badge>
            case 'rejected': return <Badge variant="destructive">Rechazado</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/quotes" className="text-gray-400 hover:text-white">
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-white">{quote.quote_number}</h1>
                            {getStatusBadge(quote.status)}
                        </div>
                        <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(quote.date), 'dd MMMM yyyy', { locale: es })}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <div className="bg-white/5 p-1 rounded-lg border border-white/10 flex items-center gap-2">
                        <QuotePDFButton quote={quote} client={client} />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">

                {/* Main Content: Info & Items */}
                <div className="md:col-span-2 space-y-6">

                    {/* Items Table */}
                    <Card className="bg-[#1a1a1a] border border-[#333] text-white overflow-hidden">
                        <CardHeader className="bg-[#111] border-b border-[#333] py-3">
                            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Conceptos del Presupuesto
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-[#0a0a0a] border-b border-[#333]">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Concepto / Descripción</th>
                                            <th className="px-6 py-3 font-medium text-right">Precio</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#333]">
                                        {quote.items?.map((item: any, index: number) => (
                                            <tr key={index} className="bg-[#1a1a1a] hover:bg-[#222]">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-white text-base">{item.concept}</div>
                                                    {item.description && (
                                                        <div className="text-gray-400 mt-1 whitespace-pre-wrap leading-relaxed max-w-prose">
                                                            {item.description}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-white text-base whitespace-nowrap align-top">
                                                    {Number(item.price).toFixed(2)} €
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                        {/* Total Footer */}
                        <div className="bg-[#111] p-6 flex flex-col items-end border-t border-[#333]">
                            <div className="text-gray-400 text-sm mb-1 uppercase tracking-wider">Total Presupuesto</div>
                            <div className="text-4xl font-black text-white">{Number(quote.total).toFixed(2)} €</div>
                        </div>
                    </Card>

                    {/* Notes */}
                    {quote.notes && (
                        <Card className="bg-[#1a1a1a] border border-[#333] text-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">Notas y Condiciones</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-300 whitespace-pre-wrap">{quote.notes}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar: Client Info */}
                <div className="space-y-6">
                    <Card className="bg-white border-none shadow-lg text-black">
                        <CardHeader className="pb-4 border-b border-gray-100">
                            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Información del Cliente</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center gap-3">
                                {client.image_url ? (
                                    <img src={client.image_url} className="h-12 w-12 object-contain rounded-md border border-gray-100" />
                                ) : (
                                    <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                                        <User className="h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-lg leading-tight truncate">{client.trade_name || client.nombre_fiscal}</h3>
                                    <p className="text-xs text-gray-500">{client.cif_nif}</p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2 text-sm">
                                <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 text-red-600" />
                                    <span className="font-medium">{client.nombre_contacto || 'Sin contacto'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-red-600" />
                                    <a href={`mailto:${client.email_contacto}`} className="hover:underline text-gray-600">{client.email_contacto || '-'}</a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-red-600" />
                                    <span className="text-gray-600">{client.telefono || client.mobile_phone || '-'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 text-red-600" />
                                    <span className="text-gray-600 line-clamp-2">
                                        {client.direccion ? `${client.direccion}, ${client.poblacion}` : '-'}
                                    </span>
                                </div>
                                {client.website_url && (
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-4 w-4 text-red-600" />
                                        <a href={client.website_url} target="_blank" className="hover:underline text-blue-600 truncate">{client.website_url}</a>
                                    </div>
                                )}
                            </div>

                            <Button variant="outline" className="w-full mt-4 border-gray-300 hover:bg-gray-50 text-gray-700" asChild>
                                <Link href={`/clients/${client.id}`}>
                                    Ver Ficha Cliente
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
