'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
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
import { createClientAction } from '@/app/(dashboard)/clients/actions'

export function ClientDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.currentTarget)

        const result = await createClientAction(formData)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Cliente creado correctamente')
            setOpen(false)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#8B0000] hover:bg-[#A50000] text-white">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-[#1a1a1a] text-white border-gray-800">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Añadir Nuevo Cliente</DialogTitle>
                        <DialogDescription>
                            Introduce los datos fiscales y de contacto del cliente.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* 1. FOTO (Grande y Rectangular) */}
                        <div className="space-y-2">
                            <Label htmlFor="logo">Logo / Foto Empresa</Label>
                            <div className="flex items-center gap-4">
                                <div className="h-24 w-48 bg-[#2a2a2a] border border-dashed border-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                                    {/* This is a placeholder visual since we can't preview the file immediately without JS complexity, 
                                         but the input below handles the file. We make the input wide to match req. */}
                                    <span className="text-gray-500 text-xs text-center px-2">Subir Imagen<br />(Formato Panorámico)</span>
                                </div>
                                <Input id="logo" name="logo" type="file" accept="image/*" className="flex-1 bg-[#2a2a2a] border-gray-700 text-gray-400 file:text-white file:bg-gray-800 file:border-0 file:rounded-md file:px-2 file:mr-2 hover:file:bg-gray-700" />
                            </div>
                        </div>

                        {/* 2. DATOS PRINCIPALES */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="trade_name" className="text-red-400 font-bold">Nombre Comercial *</Label>
                                <Input id="trade_name" name="trade_name" required placeholder="Ej: Talleres Pepe" className="bg-[#2a2a2a] border-gray-700 font-semibold" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company_name">Razón Social (Fiscal) *</Label>
                                <Input id="company_name" name="company_name" required placeholder="Ej: Talleres Pepe S.L." className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nif_cif">NIF / CIF</Label>
                                <Input id="nif_cif" name="nif_cif" className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_name">Persona de Contacto</Label>
                                <Input id="contact_name" name="contact_name" className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                        </div>

                        {/* 3. CONTACTO */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contact_phone">Teléfono Fijo</Label>
                                <Input id="contact_phone" name="contact_phone" className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mobile_phone">Móvil</Label>
                                <Input id="mobile_phone" name="mobile_phone" className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contact_email">Email *</Label>
                                <Input id="contact_email" name="contact_email" type="email" required className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website_url">Sitio Web</Label>
                                <Input id="website_url" name="website_url" placeholder="https://" className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                        </div>

                        {/* 4. DIRECCIÓN */}
                        <div className="space-y-2">
                            <Label htmlFor="address">Dirección Completa</Label>
                            <Input id="address" name="address" className="bg-[#2a2a2a] border-gray-700" />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">Población</Label>
                                <Input id="city" name="city" className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="province">Provincia</Label>
                                <Input id="province" name="province" className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="postal_code">C. Postal</Label>
                                <Input id="postal_code" name="postal_code" className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notas Internas</Label>
                            <Textarea id="notes" name="notes" className="bg-[#2a2a2a] border-gray-700" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="bg-[#8B0000] hover:bg-[#A50000] text-white">
                            {loading ? 'Guardando...' : 'Guardar Cliente'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
