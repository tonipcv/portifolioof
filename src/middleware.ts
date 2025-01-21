import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas que requerem autenticação
const authRoutes = ['/portfolios', '/analises', '/ativos-recomendados', '/gpt']

// Rotas que requerem premium
const premiumRoutes = ['/gpt']

// Rotas públicas que não precisam de autenticação
const publicRoutes = ['/login', '/register', '/forgot-password']

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))

    console.log('Middleware - Token:', token ? 'exists' : 'not found', 'Environment:', process.env.NODE_ENV)
    console.log('Middleware - Request URL:', req.nextUrl.pathname)
    console.log('Middleware - Token Data:', {
      subscriptionStatus: token?.subscriptionStatus,
      user: token?.user,
      email: token?.email
    })

    // Se não estiver autenticado e não for uma rota pública
    if (!token && !isPublicRoute) {
      console.log('Middleware - Redirecting to login')
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Se estiver autenticado e tentar acessar uma rota pública
    if (token && isPublicRoute) {
      console.log('Middleware - Redirecting to portfolios')
      return NextResponse.redirect(new URL('/portfolios', req.url))
    }

    // Verificar acesso premium
    if (premiumRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      const isPremium = token?.subscriptionStatus === 'premium'
      console.log('Middleware - Premium check:', { isPremium, subscriptionStatus: token?.subscriptionStatus })
      
      if (!isPremium) {
        console.log('Middleware - Redirecting to pricing (not premium)')
        return NextResponse.redirect(new URL('/pricing', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return true // Deixar a lógica de autorização para o middleware
      }
    }
  }
)

// Configurar quais rotas o middleware deve proteger
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|manifest).*)',
  ],
} 