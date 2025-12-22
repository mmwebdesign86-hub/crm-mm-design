import { Rocket, Palette, RefreshCw, ShoppingCart, Wrench, TrendingUp, Share2, PenTool, Cloud, Globe } from 'lucide-react'

export const SERVICE_TYPES = [
    { value: 'launch_pack_12m', label: 'Pack “Despega 12M”', icon: Rocket },
    { value: 'web_design', label: 'Diseño Web', icon: Palette },
    { value: 'web_redesign', label: 'Rediseño Web', icon: RefreshCw },
    { value: 'ecommerce', label: 'Tienda Online', icon: ShoppingCart },
    { value: 'web_maintenance', label: 'Mantenimiento Web', icon: Wrench },
    { value: 'seo', label: 'Posicionamiento SEO', icon: TrendingUp },
    { value: 'social_media', label: 'Gestión de Redes Sociales', icon: Share2 },
    { value: 'content_creation', label: 'Contenido para Blogs y Sitios Web', icon: PenTool },
    { value: 'hosting', label: 'Hosting', icon: Cloud },
    { value: 'domain', label: 'Dominio', icon: Globe },
] as const

export const getServiceLabel = (value: string | null) => {
    if (!value) return '-'
    const service = SERVICE_TYPES.find(s => s.value === value)
    return service ? service.label : value
}

export const getServiceIcon = (value: string | null) => {
    const service = SERVICE_TYPES.find(s => s.value === value)
    return service ? service.icon : Globe // Default icon
}
