'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { updateClientAction } from '@/app/(dashboard)/clients/[id]/actions'
import { Database } from '@/types/database.types'

type Client = Database['public']['Tables']['clients']['Row']

export function ClientEditDialog({
    client,
    open,
    onOpenChange
}: {
    client: Client
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.currentTarget)
        formData.append('id', client.id)

        const result = await updateClientAction(formData)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Cliente actualizado correctamente')
            onOpenChange(false)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-[#1a1a1a] text-white border-gray-800 outline-none">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Editar Cliente</DialogTitle>
                        <DialogDescription>
                            Modifica los datos fiscales y de contacto.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">

                        {/* 1. FOTO (Grande y Rectangular) */}
                        <div className="space-y-2">
                            <Label htmlFor="logo">Logo / Foto Empresa</Label>
                            <div className="flex items-center gap-4">
                                {client.image_url ? (
                                    <div className="relative h-24 w-48 rounded-md overflow-hidden border border-gray-700 bg-white">
                                        <img src={client.image_url} alt="Logo actual" className="object-contain w-full h-full" />
                                    </div>
                                ) : (
                                    <div className="h-24 w-48 bg-gray-800 rounded-md flex items-center justify-center border border-gray-700">
                                        <span className="text-xs text-gray-500">Sin Logo</span>
                                    </div>
                                )}
                                <div className="flex-1 space-y-2">
                                    <Input id="logo" name="logo" type="file" accept="image/*" className="bg-[#2a2a2a] border-gray-700 text-gray-400 file:text-white file:bg-gray-800 file:border-0 file:rounded-md file:px-2 file:mr-2 hover:file:bg-gray-700" />
                                    <p className="text-xs text-gray-500">Haz clic para cambiar imagen (Panorámica)</p>
                                </div>
                            </div>
                        </div>

                        {/* 2. DATOS PRINCIPALES */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="trade_name" className="text-red-400 font-bold">Nombre Comercial *</Label>
                                <Input
                                    id="trade_name"
                                    name="trade_name"
                                    defaultValue={client.trade_name || ''}
                                    required
                                    className="bg-[#2a2a2a] border-gray-700 font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nombre_fiscal">Razón Social (Fiscal) *</Label>
                                <Input
                                    id="nombre_fiscal"
                                    name="nombre_fiscal"
                                    defaultValue={client.nombre_fiscal}
                                    required
                                    className="bg-[#2a2a2a] border-gray-700"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cif_nif">NIF / CIF</Label>
                                <Input
                                    id="cif_nif"
                                    name="cif_nif"
                                    defaultValue={client.cif_nif || ''}
                                    className="bg-[#2a2a2a] border-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nombre_contacto">Persona de Contacto</Label>
                                <Input
                                    id="nombre_contacto"
                                    name="nombre_contacto"
                                    defaultValue={client.nombre_contacto || ''}
                                    className="bg-[#2a2a2a] border-gray-700"
                                />
                            </div>
                        </div>

                        {/* 3. CONTACTO */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="telefono">Teléfono Fijo</Label>
                                <Input
                                    id="telefono"
                                    name="telefono"
                                    defaultValue={client.telefono || ''}
                                    className="bg-[#2a2a2a] border-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mobile_phone">Móvil</Label>
                                <Input
                                    id="mobile_phone"
                                    name="mobile_phone"
                                    defaultValue={client.mobile_phone || ''}
                                    className="bg-[#2a2a2a] border-gray-700"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email_contacto">Email Contacto *</Label>
                                <Input
                                    id="email_contacto"
                                    name="email_contacto"
                                    type="email"
                                    defaultValue={client.email_contacto}
                                    required
                                    className="bg-[#2a2a2a] border-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website_url">Sitio Web</Label>
                                <Input
                                    id="website_url"
                                    name="website_url"
                                    defaultValue={client.website_url || ''}
                                    className="bg-[#2a2a2a] border-gray-700"
                                />
                            </div>
                        </div>

                        {/* 4. DIRECCIÓN */}
                        <div className="space-y-2">
                            <Label htmlFor="direccion">Dirección Completa</Label>
                            <Input
                                id="direccion"
                                name="direccion"
                                defaultValue={client.direccion || ''}
                                className="bg-[#2a2a2a] border-gray-700"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="poblacion">Población</Label>
                                <Input
                                    id="poblacion"
                                    name="poblacion"
                                    defaultValue={client.poblacion || ''}
                                    className="bg-[#2a2a2a] border-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="province">Provincia</Label>
                                <Input
                                    id="province"
                                    name="province"
                                    defaultValue={client.province || ''}
                                    className="bg-[#2a2a2a] border-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="codigo_postal">C. Postal</Label>
                                <Input
                                    id="codigo_postal"
                                    name="codigo_postal"
                                    defaultValue={client.codigo_postal || ''}
                                    className="bg-[#2a2a2a] border-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notas">Notas Internas</Label>
                            <Textarea
                                id="notas"
                                name="notas"
                                defaultValue={client.notas || ''}
                                className="bg-[#2a2a2a] border-gray-700"
                            />
                        </div>

                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="bg-[#8B0000] hover:bg-[#A50000] text-white">
                            {loading ? 'Guardando...' : 'Actualizar Cliente'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
