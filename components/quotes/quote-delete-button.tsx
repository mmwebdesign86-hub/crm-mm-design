'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteQuoteAction } from '@/app/(dashboard)/quotes/actions'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function QuoteDeleteButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de que quieres eliminar este presupuesto? Esta acción no se puede deshacer.')) {
            return
        }

        startTransition(async () => {
            const result = await deleteQuoteAction(id)
            if (result.error) {
                alert(result.error)
            } else {
                router.refresh()
            }
        })
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isPending}
            className="text-gray-400 hover:text-red-500 hover:bg-red-500/10"
            title="Eliminar Presupuesto"
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    )
}
