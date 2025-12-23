import { createClient } from '@/lib/supabase/server'
import { QuoteForm } from '@/components/quotes/quote-form'
import { notFound } from 'next/navigation'

export default async function EditQuotePage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    // Robustly handle params for Next.js 15+ compatibility
    // In Next.js 15 params is a promise, but in 14 it is not.
    // If it's a promise, await it. If not, use it directly.
    const resolvedParams = await Promise.resolve(params)
    const id = resolvedParams.id

    // Fetch quote
    const { data: quote } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
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
