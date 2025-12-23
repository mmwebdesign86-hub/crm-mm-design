'use client'

import { Badge } from '@/components/ui/badge'
import { updateQuoteStatusAction } from '@/app/(dashboard)/quotes/actions'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuoteStatusToggleProps {
    id: string
    initialStatus: string
}

export function QuoteStatusToggle({ id, initialStatus }: QuoteStatusToggleProps) {
    const [status, setStatus] = useState(initialStatus)
    const [isLoading, setIsLoading] = useState(false)

    const isAccepted = status === 'accepted'

    const toggleStatus = async () => {
        if (isLoading) return
        setIsLoading(true)

        // Logic: Toggle between 'accepted' and 'draft' (acting as Pending)
        const newStatus = isAccepted ? 'draft' : 'accepted'

        const result = await updateQuoteStatusAction(id, newStatus)

        if (result?.success) {
            setStatus(newStatus)
        } else {
            alert('Error al actualizar el estado')
        }
        setIsLoading(false)
    }

    return (
        <div onClick={toggleStatus} className="cursor-pointer select-none">
            <Badge
                className={cn(
                    "transition-all duration-300 flex items-center gap-1.5 px-3 py-1",
                    isAccepted
                        ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200"
                )}
            >
                {isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                    <div className={cn("h-2 w-2 rounded-full", isAccepted ? "bg-green-500" : "bg-gray-400")} />
                )}
                {isAccepted ? 'ACEPTADO' : 'PENDIENTE'}
            </Badge>
        </div>
    )
}
