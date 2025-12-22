'use client'

import { Database } from '@/types/database.types'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format, isPast, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { ServiceEditDialog } from './service-edit-dialog'
import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { deleteServiceAction, toggleServiceNotification } from '@/app/(dashboard)/clients/[id]/actions'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { getServiceLabel, getServiceIcon } from '@/lib/constants'

type Service = Database['public']['Tables']['services']['Row']

export function ServiceList({ services }: { services: Service[] }) {

    const handleDelete = async (serviceId: string, clientId: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este servicio de forma permanente?')) {
            const result = await deleteServiceAction(serviceId, clientId)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Servicio eliminado correctamente')
            }
        }
    }

    const handleToggleNotification = async (serviceId: string, clientId: string, currentState: boolean | null) => {
        // Optimistic toggle (optional optimization, but simple await is fine for now)
        const newState = !currentState
        const result = await toggleServiceNotification(serviceId, clientId, newState)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(newState ? 'Avisos ACTIVADOS' : 'Avisos DESACTIVADOS')
        }
    }

    const getStatusBadge = (service: Service) => {
        if (!service.end_date) return <Badge variant="outline">Sin Fecha</Badge>
        // Check if expired
        const expired = isPast(parseISO(service.end_date))
        if (expired) {
            return <Badge className="bg-red-900 text-white hover:bg-red-800">VENCIDO</Badge>
        }
        if (service.status === 'cancelled') {
            return <Badge variant="secondary">Cancelado</Badge>
        }
        return <Badge className="bg-green-900 text-white hover:bg-green-800">ACTIVO</Badge>
    }

    return (
        <div className="rounded-md border border-[#333] mt-4">
            <Table>
                <TableHeader>
                    <TableRow className="border-[#333] hover:bg-transparent">
                        <TableHead className="text-gray-400">Servicio</TableHead>
                        <TableHead className="text-gray-400">Detalle</TableHead>
                        <TableHead className="text-gray-400">Precio</TableHead>
                        <TableHead className="text-gray-400">Vencimiento</TableHead>
                        <TableHead className="text-gray-400 text-center">Avisos</TableHead>
                        <TableHead className="text-right text-gray-400">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {services.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                No hay servicios contratados.
                            </TableCell>
                        </TableRow>
                    ) : (
                        services.map((service) => (
                            <TableRow key={service.id} className="border-[#333] hover:bg-[#1a1a1a]">
                                <TableCell className="font-medium text-white flex items-center gap-3">
                                    {(() => {
                                        const Icon = getServiceIcon(service.type)
                                        return <Icon className="h-5 w-5 text-[#DC2626]" />
                                    })()}
                                    {getServiceLabel(service.type)}
                                </TableCell>
                                <TableCell className="text-gray-300">{service.description || '-'}</TableCell>
                                <TableCell className="text-gray-300">{service.price ? `${service.price}€` : '-'}</TableCell>
                                <TableCell className="text-gray-300">
                                    {service.end_date ? format(parseISO(service.end_date), 'dd/MM/yyyy') : '-'}
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <Switch
                                            checked={service.avisos_activos ?? true}
                                            onCheckedChange={() => handleToggleNotification(service.id, service.client_id, service.avisos_activos ?? true)}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="text-right flex justify-end items-center gap-2">
                                    {getStatusBadge(service)}
                                    <ServiceEditDialog service={service} />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-950/30"
                                        onClick={() => handleDelete(service.id, service.client_id)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
