import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequestWithAuth } from 'next-auth/middleware'

// Rotas que requerem autenticação
const authRoutes = ['/portfolios', '/ativos-recomendados', '/chat', '/gpt']

// Rotas que requerem premium
const premiumRoutes = ['/gpt']

export default async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({ req: request })
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
    if (!token?.isPremium) {
      return NextResponse.redirect(new URL('/pricing', request.url))
    }
  }

  // Verifica acesso ao GPT (liberado para não-free)
  if (pathname.startsWith('/gpt')) {
    if (token?.plan === 'free') {
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