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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { createServiceAction } from '@/app/(dashboard)/clients/[id]/actions'

export function ServiceDialog({ clientId }: { clientId: string }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.currentTarget)
        formData.append('client_id', clientId)

        const result = await createServiceAction(formData)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Servicio añadido correctamente')
            setOpen(false)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#8B0000] hover:bg-[#A50000] text-white">
                    <Plus className="mr-2 h-4 w-4" /> Añadir Servicio
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-[#1a1a1a] text-white border-gray-800">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Nuevo Servicio</DialogTitle>
                        <DialogDescription>
                            Registra un nuevo servicio o renovación para este cliente.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo de Servicio *</Label>
                            import {SERVICE_TYPES} from '@/lib/constants'

                            // ... (in component)
                            <Select name="type" required>
                                <SelectTrigger className="bg-[#2a2a2a] border-gray-700">
                                    <SelectValue placeholder="Selecciona..." />
                                </SelectTrigger>
                                <SelectContent className="bg-[#2a2a2a] border-gray-700 text-white">
                                    {SERVICE_TYPES.map((service) => (
                                        <SelectItem key={service.value} value={service.value}>
                                            {service.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Fecha Inicio</Label>
                                <Input id="start_date" name="start_date" type="date" className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end_date">Vencimiento *</Label>
                                <Input id="end_date" name="end_date" type="date" required className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Precio (€)</Label>
                                <Input id="price" name="price" type="number" step="0.01" className="bg-[#2a2a2a] border-gray-700" />
                            </div>
                            {/* Billing Cycle removed - defaults to yearly */}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Detalles Adicionales</Label>
                            <Textarea id="description" name="description" placeholder="Ej: Renovación dominio .com" className="bg-[#2a2a2a] border-gray-700" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="bg-[#8B0000] hover:bg-[#A50000] text-white">
                            {loading ? 'Guardando...' : 'Guardar Servicio'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
