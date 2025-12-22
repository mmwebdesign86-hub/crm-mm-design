import { createClient } from '@/lib/supabase/server'
import { QuoteForm } from '@/components/quotes/quote-form'

export default async function CreateQuotePage() {
    const supabase = await createClient()

    // Fetch clients for dropdown selector
    const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .order('nombre_fiscal', { ascending: true })

    return <QuoteForm clients={clients || []} />
}
