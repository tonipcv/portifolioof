import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

// Rotas que requerem autenticação
const authRoutes = ['/portfolios', '/analises', '/ativos-recomendados', '/gpt']

// Rotas que requerem premium
const premiumRoutes = ['/gpt']

// Rotas públicas
const publicRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  const path = request.nextUrl.pathname

  // Redirecionar usuário não autenticado para login
  if (!token && authRoutes.some(route => path.startsWith(route))) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(url)
  }

  // Redirecionar usuário autenticado para portfolios
  if (token && publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/portfolios', request.url))
  }

  // Verificar acesso premium
  if (token && premiumRoutes.some(route => path.startsWith(route))) {
    // @ts-ignore
    if (token.subscriptionStatus !== 'premium') {
      return NextResponse.redirect(new URL('/pricing', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/portfolios/:path*',
    '/ativos-recomendados/:path*',
    '/analises/:path*',
    '/gpt/:path*',
    '/profile/:path*',
    '/api/auth/:path*',
    '/login',
    '/register'
  ]
} 