'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
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
    const [urls, setUrls] = useState<string[]>([''])

    const addUrl = () => setUrls([...urls, ''])
    const removeUrl = (index: number) => {
        if (urls.length > 1) {
            const newUrls = [...urls]
            newUrls.splice(index, 1)
            setUrls(newUrls)
        }
    }

    const handleUrlChange = (index: number, value: string) => {
        const newUrls = [...urls]
        newUrls[index] = value
        setUrls(newUrls)
    }

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
            setUrls(['']) // Reset URLs
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

                            {/* MULTI-WEB SUPPORT */}
                            <div className="space-y-2">
                                <Label>Sitio Web</Label>
                                {urls.map((url, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            name="website_urls"
                                            value={url}
                                            onChange={(e) => handleUrlChange(index, e.target.value)}
                                            placeholder="https://"
                                            className="bg-[#2a2a2a] border-gray-700"
                                        />
                                        {/* Show trash only if more than 1 item, or maybe allow clearing if 1? User req: trash button next to each to remove. */}
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeUrl(index)} disabled={urls.length === 1 && url === ''} className="text-red-400 hover:text-red-300">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>

                                        {/* Plus button only on the last item */}
                                        {index === urls.length - 1 && (
                                            <Button type="button" variant="ghost" size="icon" onClick={addUrl} className="text-green-400 hover:text-green-300">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
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
