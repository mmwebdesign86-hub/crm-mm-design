'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database.types'

export async function createClientAction(formData: FormData) {
    const supabase = await createClient()

    // Extract data from formData
    const company_name = formData.get('company_name') as string
    const fiscal_name = formData.get('fiscal_name') as string
    const nif_cif = formData.get('nif_cif') as string
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const postal_code = formData.get('postal_code') as string
    const contact_name = formData.get('contact_name') as string
    const contact_email = formData.get('contact_email') as string
    const contact_phone = formData.get('contact_phone') as string
    const notes = formData.get('notes') as string

    // Simple validation
    if (!company_name || !contact_email) {
        return { error: 'Nombre de empresa y email de contacto son obligatorios' }
    }

    // company_name (from form) -> nombre_fiscal
    // contact_email (from form) -> email_contacto

    let image_url = null
    const logoFile = formData.get('logo') as File

    if (logoFile && logoFile.size > 0) {
        const fileName = `${Date.now()}_${logoFile.name.replace(/\s+/g, '-')}`
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('clients-logos')
            .upload(fileName, logoFile)

        if (uploadError) {
            console.error('Error uploading logo:', uploadError)
            // We continue creating client anyway, but log error.
            // Or return error? User strictness: robust code.
            // Let's log and continue without logo for now to avoid blocking client creation.
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('clients-logos')
                .getPublicUrl(uploadData.path)
            image_url = publicUrl
        }
    }

    const newClient: Database['public']['Tables']['clients']['Insert'] = {
        nombre_fiscal: company_name,
        cif_nif: nif_cif || null,
        direccion: address || null,
        poblacion: city || null,
        codigo_postal: postal_code || null,
        nombre_contacto: contact_name || null,
        email_contacto: contact_email,
        telefono: contact_phone || null,
        notas: notes || null,
        image_url: image_url
    } as any

    const { error } = await supabase.from('clients').insert(newClient)

    if (error) {
        console.error('Error creating client:', error)
        return { error: `Error al crear el cliente: ${error.message}` }
    }

    revalidatePath('/clients')
    return { success: true }
}
