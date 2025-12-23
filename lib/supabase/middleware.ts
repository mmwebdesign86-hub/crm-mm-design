import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // REFRESH SESSION
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // ------------------------------------------------------------------------
    // PROTECCIÓN DE RUTAS (MIDDLEWARE SECURITY)
    // ------------------------------------------------------------------------

    // Rutas públicas que NO requieren autenticación
    const publicPaths = ['/login', '/auth/callback']
    const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

    // Rutas de API que pueden tener su propia seguridad (ej: CRON)
    const isApiCron = request.nextUrl.pathname.startsWith('/api/cron')

    // 1. Si el usuario NO está logueado y la ruta NO es pública ni API especial
    //    -> Redirigir a /login
    if (!user && !isPublicPath && !isApiCron
        const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
}

// 2. Si el usuario SÍ está logueado y trata de ir a /login
//    -> Redirigir al Dashboard (/)
if (user && isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
}

return response
}
