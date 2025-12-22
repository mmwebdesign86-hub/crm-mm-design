'use client'

import { Button } from '@/components/ui/button'
import { FileText, Mail } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'

interface QuotePDFButtonProps {
    quote: any
    client: any
}

export function QuotePDFButton({ quote, client }: QuotePDFButtonProps) {

    const generatePDF = async () => {
        const doc = new jsPDF()

        // --- COMPANY LOGO & INFO ---
        const logoUrl = 'https://files.cdn-files-a.com/uploads/9284533/normal_694957bcd697a.png'

        try {
            // 1. Fetch Logo Blob (Attempt to bypass basic CORS or use cache)
            const response = await fetch(logoUrl, { mode: 'no-cors' }) // Try no-cors first or standard
            // Note: 'no-cors' returns opaque response not usable for blob usually.
            // Let's try standard fetch. If it fails, we go to text.
            // Actually, for jsPDF addImage to work with URL, it needs to be accessible.
            // Better approach: Try to fetch blob. If fails, text.

            // Re-attempt with standard fetch (if server supports CORS)
            const realResponse = await fetch(logoUrl)
            if (!realResponse.ok) throw new Error('Network response was not ok')
            const blob = await realResponse.blob()

            // Convert to Base64
            const reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onloadend = () => {
                const base64data = reader.result as string
                if (base64data) {
                    doc.addImage(base64data, 'PNG', 15, 10, 50, 40) // Adjusted Logo size/pos
                    continuePDFGeneration(doc)
                }
            }
            reader.onerror = () => {
                throw new Error('FileReader error')
            }

        } catch (error) {
            console.warn('Logo load failed, using Text Fallback:', error)
            // FALLBACK: TEXT "MM DESIGN WEB"
            doc.setTextColor(220, 38, 38) // MM Red
            doc.setFontSize(22) // Impact Size
            doc.setFont('helvetica', 'bold')
            doc.text('MM DESIGN WEB', 15, 25)

            doc.setTextColor(50, 50, 50) // Gray
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.text('WEB & SEO STUDIO', 15, 32) // Spacing

            continuePDFGeneration(doc)
        }
    }

    const continuePDFGeneration = (doc: jsPDF) => {
        // --- REST OF PDF GENERATION ---

        // Mario's Info (Right aligned) - Same as before
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text('MM DESIGN WEB', 195, 20, { align: 'right' })
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.text('Mario Albaladejo Barastegui', 195, 25, { align: 'right' })
        doc.text('NIF: 36044306-P', 195, 30, { align: 'right' })
        doc.text('C/ Sant Ramon, 29 Bajos', 195, 35, { align: 'right' })
        doc.text('08350, Arenys de Mar, Barcelona', 195, 40, { align: 'right' })
        doc.text('656948148 | contacto@mmdesignweb.com', 195, 45, { align: 'right' })

        // --- TITLE & CLIENT INFO ---
        doc.setDrawColor(200, 200, 200)
        doc.line(15, 55, 195, 55)

        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text(`PRESUPUESTO: ${quote.quote_number}`, 15, 70)

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(`Fecha: ${format(new Date(quote.date), 'dd/MM/yyyy')}`, 15, 76)

        // Client Box
        doc.setFillColor(245, 245, 245)
        doc.roundedRect(15, 85, 90, 35, 2, 2, 'F')

        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text('CLIENTE:', 20, 92)
        doc.setFont('helvetica', 'normal')

        // Handle potentially null fields
        const clientName = client.nombre_fiscal || client.trade_name || 'Cliente'
        const clientNif = client.cif_nif || ''
        const clientAddress = client.direccion ? `${client.direccion}, ${client.poblacion || ''}` : ''

        doc.text(clientName, 20, 98)
        doc.text(clientNif, 20, 103)
        doc.text(clientAddress, 20, 108)
        if (client.email_contacto) doc.text(client.email_contacto, 20, 113)

        // --- ITEMS TABLE ---
        const tableBody = quote.items.map((item: any) => [
            item.concept,
            item.description,
            `${Number(item.price).toFixed(2)}€`
        ])

        autoTable(doc, {
            startY: 130,
            head: [['Concepto', 'Descripción', 'Precio']],
            body: tableBody,
            theme: 'grid',
            headStyles: {
                fillColor: [220, 38, 38],
                textColor: 255,
                fontStyle: 'bold',
                halign: 'left'
            },
            columnStyles: {
                0: { cellWidth: 35, fontStyle: 'bold' },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 35, halign: 'right' }
            },
            styles: {
                fontSize: 10,
                cellPadding: 3,
                overflow: 'linebreak',
                valign: 'top',
                textColor: [50, 50, 50]
            },
            didDrawPage: (data) => {
                // Footer helper if needed
            }
        })

        // --- TOTAL ---
        // @ts-ignore
        const finalY = doc.lastAutoTable.finalY || 150

        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(`TOTAL: ${Number(quote.total).toFixed(2)}€`, 195, finalY + 15, { align: 'right' })

        // --- NOTES & FOOTER ---
        if (quote.notes) {
            doc.setFontSize(9)
            doc.setFont('helvetica', 'bold')
            doc.text('Notas:', 15, finalY + 15)
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(8)
            const splitNotes = doc.splitTextToSize(quote.notes, 100)
            doc.text(splitNotes, 15, finalY + 20)
        }

        doc.setFontSize(8)
        doc.setTextColor(150)
        doc.text('Presupuesto válido por 30 días.', 105, 280, { align: 'center' })
        doc.text('Gracias por su confianza - MM DESIGN WEB', 105, 285, { align: 'center' })

        // Save
        doc.save(`Presupuesto_${quote.quote_number}.pdf`)
    }

    const handleEmail = () => {
        const subject = encodeURIComponent(`Presupuesto ${quote.quote_number} - MM Design Web`)
        const body = encodeURIComponent(`Hola ${client.nombre_contacto || 'Cliente'},\n\nAdjunto le remito el presupuesto detallado ${quote.quote_number} para su revisión.\n\nQuedo a la espera de sus comentarios.\n\nAtentamente,\nMario Albaladejo - MM Design Web`)
        window.location.href = `mailto:${client.email_contacto}?subject=${subject}&body=${body}`
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="flex items-center gap-2 print:hidden">
            <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="text-gray-600 border-gray-200 hover:bg-gray-50"
                title="Imprimir"
            >
                🖨️ Imprimir
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={generatePDF}
                className="text-red-600 border-red-200 hover:bg-red-50"
                title="Descargar PDF"
            >
                <FileText className="h-4 w-4 mr-1" />
                PDF
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={handleEmail}
                className="text-gray-600 border-gray-200 hover:bg-gray-50"
                title="Enviar por Email"
            >
                <Mail className="h-4 w-4 mr-1" />
                Email
            </Button>
        </div>
    )
}
