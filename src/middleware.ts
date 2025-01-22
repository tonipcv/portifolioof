import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Rotas que requerem autenticação
const authRoutes = ['/portfolios', '/analises', '/ativos-recomendados', '/gpt']

// Rotas que requerem premium
const premiumRoutes = ['/gpt']

// Rotas públicas
const publicRoutes = ['/login', '/register', '/forgot-password']

export default withAuth(
  function middleware(req) {
    const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))
    if (isPublicRoute) {
      return NextResponse.next()
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