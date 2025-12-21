'use client'

import { signout } from "@/app/(auth)/signout/actions"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
    return (
        <form action={signout} className="w-full">
            <Button
                variant="ghost"
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                type="submit"
            >
                <LogOut className="mr-3 h-5 w-5" />
                Cerrar Sesión
            </Button>
        </form>
    )
}
