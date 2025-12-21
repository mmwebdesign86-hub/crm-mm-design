"use client"

import Image from "next/image"
import { useTransition } from "react"
import { login } from "./actions"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function LoginPage() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        startTransition(async () => {
            try {
                const result = await login(formData)
                if (result?.error) {
                    toast.error(result.error)
                } else {
                    router.push('/')
                }
            } catch (error) {
                toast.error("Error al iniciar sesión. Verifica tus credenciales.")
            }
        })
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://files.cdn-files-a.com/uploads/9284533/normal_68c40b001488f.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            </div>

            {/* Login Card */}
            <Card className="z-10 w-full max-w-md bg-black/80 border-red-900/50 text-white shadow-2xl backdrop-blur-md">
                <CardHeader className="space-y-4 flex flex-col items-center">
                    <div className="relative w-48 h-20 mb-2">
                        <Image
                            src="https://files.cdn-files-a.com/uploads/9116689/normal_68a01b0de6286.png"
                            alt="MM DESIGN WEB Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center tracking-tight text-white">
                        Acceso al Panel - MM DESIGN WEB
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-center">
                        Introduce tus credenciales para administrar el CRM
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-200">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@mmdesignweb.com"
                                required
                                className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-200">Contraseña</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary focus:ring-primary"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-[#8B0000] hover:bg-[#A50000] text-white font-bold py-2 transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-800"
                            disabled={isPending}
                        >
                            {isPending ? "Accediendo..." : "Entrar al Panel"}
                        </Button>
                    </form>

                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-xs text-gray-500">
                        Sistema Protegido | MM DESIGN WEB © {new Date().getFullYear()}
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
