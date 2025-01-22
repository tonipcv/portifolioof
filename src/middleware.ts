import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

declare module 'next-auth/jwt' {
  interface JWT {
    user?: {
      subscriptionStatus?: string
    }
  }
}

// Rotas que requerem autenticação
const authRoutes = ['/portfolios', '/analises', '/ativos-recomendados', '/gpt']

// Rotas que requerem premium
const premiumRoutes = ['/gpt', '/analises', '/ativos-recomendados']

// Rotas públicas
const publicRoutes = ['/login', '/register', '/forgot-password']

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))
    const isPremiumRoute = premiumRoutes.some(route => req.nextUrl.pathname.startsWith(route))

    if (isPublicRoute) {
      return NextResponse.next()
    }

    // Se for rota premium, verificar se usuário é premium
    if (isPremiumRoute && token?.user?.subscriptionStatus !== 'premium') {
      return NextResponse.redirect(new URL('/pricing', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))
        return isPublicRoute || !!token
      }
    },
    pages: {
      signIn: '/login',
    }
  }
)

export const config = {
  matcher: [
    '/portfolios/:path*',
    '/analises/:path*',
    '/ativos-recomendados/:path*',
    '/gpt/:path*',
    '/profile/:path*',
    '/pricing/:path*',
    '/login'
  ]
} 