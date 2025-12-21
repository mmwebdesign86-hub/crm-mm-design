'use client'

import { signout } from "@/app/(auth)/signout/actions"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
    return (
        <form action={signout} className="w-full">
            <Button
                variant="default"
                className="w-full justify-start bg-red-600 hover:bg-red-700 text-white font-bold"
                type="submit"
            >
                <LogOut className="mr-3 h-5 w-5" />
                Cerrar Sesión
            </Button>
        </form>
    )
}
