"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, LayoutDashboard, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
// import { UserNav } from "@/components/layout/user-nav"
import { LogoutButton } from "@/components/auth/logout-button"
import Image from "next/image"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Clientes",
        href: "/clients",
        icon: Users,
    },
    {
        title: "Presupuestos",
        href: "/quotes",
        icon: FileText,
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-64 flex-col border-r border-[#333] bg-[#0a0a0a] text-white">
            {/* Header / Logo */}
            <div className="flex h-16 items-center border-b border-[#333] px-6">
                <div className="relative w-32 h-10">
                    <Image
                        src="https://files.cdn-files-a.com/uploads/9116689/normal_68a01b0de6286.png"
                        alt="MM DESIGN WEB Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                pathname === item.href
                                    ? "bg-[#8B0000] text-white"
                                    : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0",
                                    pathname === item.href ? "text-white" : "text-gray-500 group-hover:text-white"
                                )}
                            />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* User / Footer */}
            <div className="border-t border-[#333] p-4 space-y-2">
                {/* <UserNav /> */}
                <LogoutButton />
                <div className="text-xs text-gray-500 text-center">v1.0.0</div>
            </div>
        </div>
    )
}
