'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database.types'

export async function createClientAction(formData: FormData) {
    try {
        const supabase = await createClient()

        // Extract data from formData
        const company_name = formData.get('company_name') as string
        const fiscal_name = formData.get('fiscal_name') as string // Seems unused in original insert but extracted? Note: 'company_name' mapped to 'nombre_fiscal' in original. 'fiscal_name' was extracted but not used? Original code: nombre_fiscal: company_name.
        const nif_cif = formData.get('nif_cif') as string
        const address = formData.get('address') as string
        const city = formData.get('city') as string
        const postal_code = formData.get('postal_code') as string
        const contact_name = formData.get('contact_name') as string
        const contact_email = formData.get('contact_email') as string
        const contact_phone = formData.get('contact_phone') as string
        const notes = formData.get('notes') as string

        const trade_name = formData.get('trade_name') as string
        const mobile_phone = formData.get('mobile_phone') as string

        // Extract all website URLs and filter out empty ones
        // Ensure strictly string[] and remove empty strings
        const website_urls_raw = formData.getAll('website_urls')
        const website_urls = website_urls_raw
            .map(url => url.toString().trim())
            .filter(url => url !== '')

        const province = formData.get('province') as string

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
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('clients-logos')
                    .getPublicUrl(uploadData.path)
                image_url = publicUrl
            }
        }

        const newClient: Database['public']['Tables']['clients']['Insert'] = {
            nombre_fiscal: company_name || null,
            trade_name: trade_name || null,
            cif_nif: nif_cif || null,
            direccion: address || null,
            poblacion: city || null,
            province: province || null,
            codigo_postal: postal_code || null,
            nombre_contacto: contact_name || null,
            email_contacto: contact_email,
            telefono: contact_phone || null,
            mobile_phone: mobile_phone || null,
            website_urls: website_urls.length > 0 ? website_urls : null,
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
    } catch (e) {
        console.error('Unexpected error in createClientAction:', e)
        return { error: 'Ocurrió un error inesperado al procesar la solicitud.' }
    }
}
