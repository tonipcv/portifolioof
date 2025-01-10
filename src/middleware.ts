import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequestWithAuth } from 'next-auth/middleware'

// Rotas que requerem autenticação
const authRoutes = ['/portfolios', '/ativos-recomendados', '/chat', '/gpt', '/analises']

// Rotas que requerem premium
const premiumRoutes = ['/gpt', '/cursos']

interface CustomToken {
  subscriptionStatus?: string;
}

export default async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({ req: request }) as CustomToken | null
  const { pathname } = request.nextUrl

  // Ignorar a rota /onboard
  if (pathname === '/onboard') {
    return NextResponse.redirect(new URL('/portfolios', request.url))
  }

  // Verifica se a rota requer autenticação
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Verifica se a rota requer premium
  if (premiumRoutes.some(route => pathname.startsWith(route))) {
    // Log para debug
    console.log('Token:', token)
    console.log('Subscription status:', token?.subscriptionStatus)
    
    if (token?.subscriptionStatus !== 'premium') {
      return NextResponse.redirect(new URL('/pricing', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|globe.svg).*)',
  ],
} 