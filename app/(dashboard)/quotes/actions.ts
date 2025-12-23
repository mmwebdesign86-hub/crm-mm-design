'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createQuoteAction(formData: FormData) {
    const supabase = await createClient()

    const client_id = formData.get('client_id') as string
    const date = formData.get('date') as string
    const notes = formData.get('notes') as string
    const itemsJson = formData.get('items') as string
    const total = formData.get('total') as string

    if (!client_id) {
        return { error: 'Debes seleccionar un cliente' }
    }

    // Generate Quote Number (Simple Auto-increment logic or Time-based for collision avoidance in MVP)
    // For a real production app, we might use a sequence or query the max number.
    // Let's use PRE-YYYYMMDD-XXXX (Full random suffix for MVP speed and safety)
    const suffix = Math.floor(1000 + Math.random() * 9000)
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const quote_number = `PRE-${todayStr}-${suffix}`

    const items = JSON.parse(itemsJson)

    const { data, error } = await supabase.from('quotes').insert({
        client_id,
        quote_number,
        date: date || new Date().toISOString(),
        status: 'draft',
        items,
        notes,
        total: parseFloat(total)
    }).select('id').single()

    if (error) {
        console.error('Error creating quote:', error)
        return { error: 'Error al guardar el presupuesto: ' + error.message }
    }

    revalidatePath('/quotes')
    return { success: true, id: data.id }
}

export async function deleteQuoteAction(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting quote:', error)
        return { error: 'Error al eliminar el presupuesto: ' + error.message }
    }

    revalidatePath('/quotes')
    // We might also want to revalidate the client page if possible, but path dependent.
    // Ideally we revalidate everything or specific paths.
    revalidatePath('/clients')
    revalidatePath('/', 'layout') // Nuclear option to ensure updates everywhere

    return { success: true }
}

export async function updateQuoteStatusAction(id: string, status: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', id)

    if (error) {
        console.error('Error updating quote status:', error)
        return { error: 'Error al actualizar el estado: ' + error.message }
    }

    revalidatePath('/quotes')
    return { success: true }
}

export async function updateQuoteAction(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string // ID for updating
    const client_id = formData.get('client_id') as string
    const date = formData.get('date') as string
    const notes = formData.get('notes') as string
    const itemsJson = formData.get('items') as string
    const total = formData.get('total') as string
    
    // Validate inputs
    if (!id) return { error: 'ID de presupuesto no encontrado' }
    if (!client_id) return { error: 'Debes seleccionar un cliente' }

    const items = JSON.parse(itemsJson)

    const { error } = await supabase
        .from('quotes')
        .update({
            client_id,
            date: date || new Date().toISOString(),
            items,
            notes,
            total: parseFloat(total)
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating quote:', error)
        return { error: 'Error al actualizar el presupuesto: ' + error.message }
    }

    revalidatePath('/quotes')
    revalidatePath(`/quotes/${id}`)
    return { success: true, id }
}
