export const SERVICE_TYPES = [
    { value: 'launch_pack_12m', label: 'Pack “Despega 12M”' },
    { value: 'web_design', label: 'Diseño Web' },
    { value: 'web_redesign', label: 'Rediseño Web' },
    { value: 'ecommerce', label: 'Tienda Online' },
    { value: 'web_maintenance', label: 'Mantenimiento Web' },
    { value: 'seo', label: 'Posicionamiento SEO' },
    { value: 'social_media', label: 'Gestión de Redes Sociales' },
    { value: 'content_creation', label: 'Contenido para Blogs y Sitios Web' },
    { value: 'hosting', label: 'Hosting' },
    { value: 'domain', label: 'Dominio' },
] as const

export const getServiceLabel = (value: string | null) => {
    if (!value) return '-'
    const service = SERVICE_TYPES.find(s => s.value === value)
    return service ? service.label : value
}
