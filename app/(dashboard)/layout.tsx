import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { createBrowserClient } from '@supabase/ssr'

import { Bell } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check for overdue services (Notification Logic)
    // We count services that are active AND have an end_date up to now (expired)
    const { count: overdueCount } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .lt('end_date', new Date().toISOString())

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Global Header */}
                <header className="flex-shrink-0 h-16 flex items-center justify-end px-6 border-b border-gray-800 bg-[#0a0a0a]">
                    <Link
                        href="/clients"
                        className="relative p-2 rounded-full hover:bg-gray-800 transition-colors group"
                        title="Ver alertas de servicio"
                    >
                        <Bell className={`h-6 w-6 ${overdueCount && overdueCount > 0 ? 'text-gray-200' : 'text-gray-500'} group-hover:text-white transition-colors`} />

                        {overdueCount && overdueCount > 0 ? (
                            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
                                {overdueCount}
                            </span>
                        ) : null}
                    </Link>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    {children}
                </main>
            </div>
        </div>
    )
}
