import { createClient } from '@/lib/supabase/server'
import { ClientDialog } from '@/components/clients/client-dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { ClientActions } from '@/components/clients/client-actions'

export default async function ClientsPage() {
    const supabase = await createClient()
    const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Gestión de Clientes</h2>
                    <p className="text-muted-foreground">Administra tu cartera y sus datos fiscales.</p>
                </div>
                <ClientDialog />
            </div>

            <div className="rounded-md border border-[#333]">
                <Table>
                    <TableHeader>
                        <TableRow className="border-[#333] hover:bg-transparent">
                            <TableHead className="text-gray-400">Empresa</TableHead>
                            <TableHead className="text-gray-400">Contacto</TableHead>
                            <TableHead className="text-gray-400">Email</TableHead>
                            <TableHead className="text-gray-400">Ciudad</TableHead>
                            <TableHead className="text-right text-gray-400">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                    No hay clientes registrados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            clients?.map((client) => (
                                <TableRow key={client.id} className="border-[#333] hover:bg-[#1a1a1a]">
                                    <TableCell className="font-medium text-white">{client.nombre_fiscal}</TableCell>
                                    <TableCell className="text-gray-300">{client.nombre_contacto || '-'}</TableCell>
                                    <TableCell className="text-gray-300">{client.email_contacto}</TableCell>
                                    <TableCell className="text-gray-300">{client.poblacion || '-'}</TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/clients/${client.id}`}>
                                                <Eye className="h-4 w-4 text-gray-400 hover:text-white" />
                                            </Link>
                                        </Button>
                                        <ClientActions client={client} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
