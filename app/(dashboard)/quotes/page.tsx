import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, FileText, Calendar, User, Search } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { QuotePDFButton } from '@/components/quotes/quote-pdf-button'
import { QuoteDeleteButton } from '@/components/quotes/quote-delete-button'

export default async function QuotesPage() {
    const supabase = await createClient()

    // Fetch quotes with client info
    const { data: quotes } = await supabase
        .from('quotes')
        .select(`
            *,
            clients (
                id,
                nombre_fiscal,
                trade_name,
                nombre_contacto,
                email_contacto,
                cif_nif,
                direccion,
                poblacion,
                codigo_postal
            )
        `)
        .order('created_at', { ascending: false })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return <Badge variant="secondary" className="bg-gray-200 text-gray-700 hover:bg-gray-300">Borrador</Badge>
            case 'sent':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">Enviado</Badge>
            case 'accepted':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Aceptado</Badge>
            case 'rejected':
                return <Badge variant="destructive">Rechazado</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Presupuestos</h2>
                    <p className="text-muted-foreground">Gestiona y envía tus propuestas comerciales.</p>
                </div>
                <Button asChild className="bg-[#DC2626] hover:bg-red-700 text-white font-bold">
                    <Link href="/quotes/create" className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Nuevo Presupuesto
                    </Link>
                </Button>
            </div>

            {/* Quote List */}
            <div className="grid gap-4">
                {quotes?.length === 0 ? (
                    <div className="text-center py-12 border border-[#333] rounded-md text-gray-500">
                        No hay presupuestos creados todavía.
                    </div>
                ) : (
                    quotes?.map((quote) => (
                        <div key={quote.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="h-12 w-12 rounded-lg bg-red-50 flex items-center justify-center border border-red-100 flex-shrink-0">
                                    <FileText className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{quote.quote_number}</h3>
                                        {getStatusBadge(quote.status)}
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium text-gray-700">
                                                {quote.clients?.trade_name || quote.clients?.nombre_fiscal}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span>{format(new Date(quote.date), 'dd MMMM yyyy', { locale: es })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Total</p>
                                    <p className="text-xl font-black text-gray-900">{Number(quote.total).toFixed(2)}€</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <QuotePDFButton quote={quote} client={quote.clients} />
                                    {/* Future Edit Actions could go here */}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
