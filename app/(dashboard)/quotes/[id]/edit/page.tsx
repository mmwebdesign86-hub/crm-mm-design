import { createClient } from '@/lib/supabase/server'
import { QuoteForm } from '@/components/quotes/quote-form'
import { notFound } from 'next/navigation'

export default async function EditQuotePage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    // Fetch quote
    const { data: quote } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!quote) {
        notFound()
    }

    // Fetch clients for dropdown selector
    const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .order('nombre_fiscal', { ascending: true })

    return <QuoteForm clients={clients || []} initialData={quote} />
}
