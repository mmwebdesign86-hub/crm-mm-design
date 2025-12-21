'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
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
import { updateServiceAction } from '@/app/(dashboard)/clients/[id]/actions'
import { Database } from '@/types/database.types'

type Service = Database['public']['Tables']['services']['Row']

export function ServiceEditDialog({ service }: { service: Service }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.currentTarget)
        formData.append('id', service.id)
        formData.append('client_id', service.client_id) // Sending client_id for revalidation

        const result = await updateServiceAction(formData)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Servicio actualizado correctamente')
            setOpen(false)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-[#1a1a1a] text-white border-gray-800">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Editar Servicio</DialogTitle>
                        <DialogDescription>
                            Modifica los detalles del servicio contratado.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo de Servicio *</Label>
                            <Select name="type" defaultValue={service.type} required>
                                <SelectTrigger className="bg-[#2a2a2a] border-gray-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#2a2a2a] border-gray-700 text-white">
                                    <SelectItem value="SEO">SEO Mensual</SelectItem>
                                    <SelectItem value="WEB">Diseño Web</SelectItem>
                                    <SelectItem value="HOSTING">Hosting y Dominio</SelectItem>
                                    <SelectItem value="MANTENIMIENTO">Mantenimiento Web</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Fecha Inicio</Label>
                                <Input
                                    id="start_date"
                                    name="start_date"
                                    type="date"
                                    defaultValue={service.start_date || ''}
                                    className="bg-[#2a2a2a] border-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end_date">Vencimiento *</Label>
                                <Input
                                    id="end_date"
                                    name="end_date"
                                    type="date"
                                    defaultValue={service.end_date || ''}
                                    required
                                    className="bg-[#2a2a2a] border-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Precio (€)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                defaultValue={service.price || 0}
                                className="bg-[#2a2a2a] border-gray-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Detalles Adicionales</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Ej: Renovación dominio .com"
                                defaultValue={service.description || ''}
                                className="bg-[#2a2a2a] border-gray-700"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="bg-[#8B0000] hover:bg-[#A50000] text-white">
                            {loading ? 'Guardando...' : 'Actualizar Servicio'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
