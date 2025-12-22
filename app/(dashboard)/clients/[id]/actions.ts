'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database.types'

export async function createServiceAction(formData: FormData) {
    const supabase = await createClient()

    const client_id = formData.get('client_id') as string
    const type = formData.get('type') as string
    const start_date = formData.get('start_date') as string
    const end_date = formData.get('end_date') as string
    const price = formData.get('price') as string
    // const billing_cycle = formData.get('billing_cycle') as string // Removed per user request
    const description = formData.get('description') as string

    if (!client_id || !type || !end_date) {
        return { error: 'Tipo, Cliente y Fecha de Vencimiento son obligatorios' }
    }

    const newService: Database['public']['Tables']['services']['Insert'] = {
        client_id,
        type,
        description: description || null,
        status: 'active',
        start_date: start_date || null,
        end_date: end_date,
        price: price ? parseFloat(price) : 0,
        billing_cycle: 'yearly', // Enforced per user request
        auto_renew: true
    }

    const { error } = await supabase.from('services').insert(newService)

    if (error) {
        console.error('Error creating service:', error)
        return { error: `Error al crear servicio: ${error.message}` }
    }

    revalidatePath(`/clients/${client_id}`)
    return { success: true }
}

export async function updateClientAction(formData: FormData) {
    try {
        const supabase = await createClient()

        const id = formData.get('id') as string
        const nombre_fiscal = formData.get('nombre_fiscal') as string
        const cif_nif = formData.get('cif_nif') as string
        const direccion = formData.get('direccion') as string
        const poblacion = formData.get('poblacion') as string
        const codigo_postal = formData.get('codigo_postal') as string
        const telefono = formData.get('telefono') as string
        const email_contacto = formData.get('email_contacto') as string
        const nombre_contacto = formData.get('nombre_contacto') as string
        const notas = formData.get('notas') as string

        const trade_name = formData.get('trade_name') as string
        const mobile_phone = formData.get('mobile_phone') as string

        // Extract all website URLs and filter out empty ones
        const website_urls_raw = formData.getAll('website_urls')
        const website_urls = website_urls_raw
            .map(url => url.toString().trim())
            .filter(url => url !== '')

        const province = formData.get('province') as string

        // Simple validation
        if (!id || !nombre_fiscal || !email_contacto) {
            return { error: 'ID, Nombre Fiscal y Email son obligatorios' }
        }

        let image_url: string | undefined = undefined
        const logoFile = formData.get('logo') as File

        if (logoFile && logoFile.size > 0) {
            const fileName = `${Date.now()}_${logoFile.name.replace(/\s+/g, '-')}`
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('clients-logos')
                .upload(fileName, logoFile)

            if (uploadError) {
                console.error('Error uploading logo (update):', uploadError)
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('clients-logos')
                    .getPublicUrl(uploadData.path)
                image_url = publicUrl
            }
        }

        const updatedClient: Database['public']['Tables']['clients']['Update'] = {
            nombre_fiscal,
            trade_name: trade_name || null,
            cif_nif: cif_nif || null,
            direccion: direccion || null,
            poblacion: poblacion || null,
            province: province || null,
            codigo_postal: codigo_postal || null,
            telefono: telefono || null,
            mobile_phone: mobile_phone || null,
            email_contacto,
            nombre_contacto: nombre_contacto || null,
            website_urls: website_urls.length > 0 ? website_urls : null,
            notas: notas || null,
            ...(image_url && { image_url }) // Only update if new image uploaded
        } as any

        const { error } = await supabase
            .from('clients')
            .update(updatedClient)
            .eq('id', id)

        if (error) {
            console.error('Error updating client:', error)
            return { error: `Error al actualizar: ${error.message}` }
        }

        revalidatePath('/clients')
        return { success: true }
    } catch (e) {
        console.error('Unexpected error in updateClientAction:', e)
        return { error: 'Ocurrió un error inesperado al actualizar el cliente.' }
    }
}

export async function updateServiceAction(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string
    const client_id = formData.get('client_id') as string
    const type = formData.get('type') as string
    const start_date = formData.get('start_date') as string
    const end_date = formData.get('end_date') as string
    const price = formData.get('price') as string
    const description = formData.get('description') as string

    if (!id || !type || !end_date) {
        return { error: 'ID, Tipo y Fecha de Vencimiento son obligatorios' }
    }

    const updatedService: Database['public']['Tables']['services']['Update'] = {
        type,
        description: description || null,
        start_date: start_date || null,
        end_date: end_date,
        price: price ? parseFloat(price) : 0,
        // status: status - not editing status here 
    }

    const { error } = await supabase
        .from('services')
        .update(updatedService)
        .eq('id', id)

    if (error) {
        console.error('Error updating service:', error)
        return { error: `Error al actualizar servicio: ${error.message}` }
    }

    if (client_id) {
        revalidatePath(`/clients/${client_id}`)
    }
    return { success: true }
}

export async function deleteServiceAction(serviceId: string, clientId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)

    if (error) {
        console.error('Error deleting service:', error)
        return { error: `Error al eliminar servicio: ${error.message}` }
    }

    revalidatePath(`/clients/${clientId}`)
    return { success: true }
}

export async function toggleServiceNotification(serviceId: string, clientId: string, isActive: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('services')
        .update({ avisos_activos: isActive })
        .eq('id', serviceId)

    if (error) {
        console.error('Error toggling notification:', error)
        return { error: `Error al cambiar estado de avisos: ${error.message}` }
    }

    revalidatePath(`/clients/${clientId}`)
    return { success: true }
}

export async function deleteClientAction(clientId: string) {
    const supabase = await createClient()

    // Delete client (services should cascade if configured in DB, otherwise we might need to delete them first)
    // Assuming 'cascade' on delete is set in DB or we just try deleting.
    const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)

    if (error) {
        console.error('Error deleting client:', error)
        return { error: `Error al eliminar cliente: ${error.message}` }
    }

    revalidatePath('/clients')
    return { success: true }
}
