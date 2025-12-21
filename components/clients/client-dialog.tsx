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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="logo">Logo Empresa</Label>
                                <Input id="logo" name="logo" type="file" accept="image/*" className="bg-[#2a2a2a] border-gray-700 text-gray-400 file:text-white file:bg-gray-800 file:border-0 file:rounded-md file:px-2 file:mr-2 hover:file:bg-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company_name">Empresa / Nombre *</Label>
                                <Input id="company_name" name="company_name" required className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nif_cif">NIF / CIF</Label>
                                <Input id="nif_cif" name="nif_cif" className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fiscal_name">Razón Social</Label>
                            <Input id="fiscal_name" name="fiscal_name" className="bg-[#2a2a2a] border-gray-700" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contact_email">Email Contacto *</Label>
                                <Input id="contact_email" name="contact_email" type="email" required className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_phone">Teléfono</Label>
                                <Input id="contact_phone" name="contact_phone" className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Dirección</Label>
                                <Input id="address" name="address" className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">Ciudad</Label>
                                <Input id="city" name="city" className="bg-[#2a2a2a] border-gray-700" />
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
