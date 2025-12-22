'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, Save, ArrowLeft } from 'lucide-react'
import { createQuoteAction } from '@/app/(dashboard)/quotes/actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function QuoteForm({ clients }: { clients: any[] }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [clientId, setClientId] = useState('')
    const [items, setItems] = useState([{ concept: '', description: '', price: 0 }])
    const [notes, setNotes] = useState('')
    const [total, setTotal] = useState(0)
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])

    // Calculate total whenever items change
    useEffect(() => {
        const newTotal = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
        setTotal(newTotal)
    }, [items])

    const addItem = () => {
        setItems([...items, { concept: '', description: '', price: 0 }])
    }

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items]
        // @ts-ignore
        newItems[index][field] = value
        setItems(newItems)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData()
        formData.append('client_id', clientId)
        formData.append('items', JSON.stringify(items))
        formData.append('notes', notes)
        formData.append('total', total.toString())
        formData.append('date', date)

        const result = await createQuoteAction(formData)

        if (result?.error) {
            alert(result.error)
            setIsLoading(false)
        } else {
            // Redirect to the new Quote Detail Page
            if (result?.id) {
                router.push(`/quotes/${result.id}`)
            } else {
                router.push('/quotes')
            }
            router.refresh()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-10">

            {/* Header Actions */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/quotes" className="text-gray-400 hover:text-white">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold text-white">Nuevo Presupuesto</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Client Selection */}
                <div className="space-y-2">
                    <Label className="text-white">Cliente</Label>
                    <Select onValueChange={setClientId} value={clientId} required>
                        <SelectTrigger className="bg-white text-black">
                            <SelectValue placeholder="Seleccionar Cliente..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black">
                            {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                    {client.trade_name || client.nombre_fiscal}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Date (Read only for now or simple) */}
                <div className="space-y-2">
                    <Label className="text-white">Fecha</Label>
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-transparent border-gray-700 text-white w-full [color-scheme:dark]"
                    />
                </div>
            </div>

            {/* Items Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                    <h3 className="text-lg font-semibold text-white">Conceptos</h3>
                    <Button type="button" onClick={addItem} variant="secondary" size="sm" className="gap-2">
                        <Plus className="h-4 w-4" /> Añadir Concepto
                    </Button>
                </div>

                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div key={index} className="grid gap-4 p-4 rounded-lg border border-gray-800 bg-[#1a1a1a] relative group">
                            <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeItem(index)}
                                    className="text-gray-500 hover:text-red-500"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="grid sm:grid-cols-12 gap-4">
                                {/* Concept */}
                                <div className="sm:col-span-8 space-y-2">
                                    <Label className="text-white font-medium">Concepto Corto</Label>
                                    <Input
                                        placeholder="Ej: Diseño Web Corporativo"
                                        value={item.concept}
                                        onChange={(e) => updateItem(index, 'concept', e.target.value)}
                                        className="bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-500 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                                        required
                                    />
                                </div>
                                {/* Price */}
                                <div className="sm:col-span-4 space-y-2">
                                    <Label className="text-white font-medium">Precio (€)</Label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={item.price}
                                        onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                                        className="bg-[#2a2a2a] border-gray-600 text-white font-mono text-right focus:border-red-600 focus:ring-1 focus:ring-red-600"
                                    />
                                </div>
                            </div>

                            {/* Description (Textarea) */}
                            <div className="space-y-2">
                                <Label className="text-white font-medium">Descripción Detallada (IA Friendly)</Label>
                                <Textarea
                                    placeholder="Detalles del servicio..."
                                    value={item.description}
                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                    className="bg-[#2a2a2a] border-gray-600 text-white min-h-[100px] focus:border-red-600 focus:ring-1 focus:ring-red-600 resize-y"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Summary */}
            <div className="flex flex-col md:flex-row md:items-start gap-8 border-t border-gray-800 pt-6">
                <div className="flex-1 space-y-2">
                    <Label className="text-white">Notas Internas / Condiciones</Label>
                    <Textarea
                        placeholder="Notas visibles al final del PDF..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="bg-[#1a1a1a] border-gray-800 text-white h-24"
                    />
                </div>

                <div className="w-full md:w-64 space-y-4 bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Base Imponible</span>
                        <span className="text-white font-mono">{total.toFixed(2)} €</span>
                    </div>
                    {/* Add VAT logic here if needed, for now just Total */}
                    <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-white">TOTAL</span>
                        <span className="text-2xl font-black text-red-500">{total.toFixed(2)} €</span>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#DC2626] hover:bg-red-700 text-white font-bold py-3 h-auto whitespace-normal leading-tight text-base shadow-lg shadow-red-900/20"
                    >
                        {isLoading ? 'Guardando...' : 'GUARDAR PRESUPUESTO'}
                    </Button>
                </div>
            </div>
        </form>
    )
}
