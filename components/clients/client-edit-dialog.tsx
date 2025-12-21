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
    DialogTrigger,
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
            {/* Trigger handled externally */}
            <DialogContent className="sm:max-w-[600px] bg-[#1a1a1a] text-white border-gray-800">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Editar Cliente</DialogTitle>
                        <DialogDescription>
                            Modifica los datos fiscales y de contacto.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">

                        <div className="flex items-center gap-4 mb-2">
                            {client.image_url ? (
                                <div className="relative h-16 w-16 rounded-md overflow-hidden border border-gray-700">
                                    <img src={client.image_url} alt="Logo actual" className="object-cover w-full h-full" />
                                </div>
                            ) : (
                                <div className="h-16 w-16 bg-gray-800 rounded-md flex items-center justify-center border border-gray-700">
                                    <span className="text-xs text-gray-500">Sin Logo</span>
                                </div>
                            )}
                            <div className="space-y-2 flex-1">
                                <Label htmlFor="logo">Logo Empresa (Opcional)</Label>
                                <Input id="logo" name="logo" type="file" accept="image/*" className="bg-[#2a2a2a] border-gray-700 text-gray-400 file:text-white file:bg-gray-800 file:border-0 file:rounded-md file:px-2 file:mr-2 hover:file:bg-gray-700" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nombre_fiscal">Nombre Fiscal *</Label>
                                <Input
                                    id="nombre_fiscal"
                                    name="nombre_fiscal"
                                    defaultValue={client.nombre_fiscal}
                                    required
                                    className="bg-[#2a2a2a] border-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cif_nif">NIF / CIF</Label>
                                <Input
                                    id="cif_nif"
                                    name="cif_nif"
                                    defaultValue={client.cif_nif || ''}
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
                                <Label htmlFor="telefono">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    name="telefono"
                                    defaultValue={client.telefono || ''}
                                    className="bg-[#2a2a2a] border-gray-700"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="direccion">Dirección</Label>
                                <Input
                                    id="direccion"
                                    name="direccion"
                                    defaultValue={client.direccion || ''}
                                    className="bg-[#2a2a2a] border-gray-700"
                                />
                            </div>
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
                                <Label htmlFor="codigo_postal">Código Postal</Label>
                                <Input
                                    id="codigo_postal"
                                    name="codigo_postal"
                                    defaultValue={client.codigo_postal || ''}
                                    className="bg-[#2a2a2a] border-gray-700"
                                />
                            </div>
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
