'use client'

import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import { format } from 'date-fns'

interface ClientExportButtonProps {
    client: any
    services: any[]
}

export function ClientExportButton({ client, services }: ClientExportButtonProps) {

    const handleExport = () => {
        // 1. Prepare Data
        const today = format(new Date(), 'yyyy-MM-dd')
        const fileName = `Cliente_${(client.trade_name || client.nombre_fiscal).replace(/\s+/g, '_')}_${today}.csv`

        // 2. Build CSV Content
        // We use semicolon (;) for better compatibility with Spanish Excel or comma (,) with quotes.
        // Let's use comma and quotes standard, but add BOM for UTF-8 Excel recognition.

        // Section 1: Client Info
        const clientHeaders = ['Nombre Comercial', 'Razón Social', 'NIF', 'Email', 'Teléfono', 'Dirección']
        const clientRow = [
            client.trade_name || '',
            client.nombre_fiscal || '',
            client.cif_nif || '',
            client.email_contacto || '',
            client.telefono || '',
            `${client.direccion || ''} ${client.poblacion || ''}`
        ]

        // Section 2: Services
        const serviceHeaders = ['Servicio', 'Descripción', 'Precio', 'Fecha Vencimiento', 'Estado']
        const serviceRows = services.map(s => {
            const isOverdue = s.end_date && new Date(s.end_date) < new Date()
            return [
                s.item || s.type,
                s.description || '',
                s.price || 0,
                s.end_date ? format(new Date(s.end_date), 'dd/MM/yyyy') : '-',
                isOverdue ? 'PENDIENTE' : 'ACTIVO' // Simplification
            ]
        })

        // Helper to escape CSV
        const escapeCsv = (row: any[]) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')

        const csvContent = [
            escapeCsv(clientHeaders),
            escapeCsv(clientRow),
            '', // Empty row
            escapeCsv(serviceHeaders),
            ...serviceRows.map(escapeCsv)
        ].join('\n')

        // 3. Trigger Download
        // Add BOM \uFEFF so Excel opens it in UTF-8
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="hidden sm:flex items-center gap-2 border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-white"
        >
            <FileDown className="h-4 w-4" />
            <span className="hidden lg:inline">Exportar Datos</span>
            <span className="lg:hidden">CSV</span>
        </Button>
    )
}
