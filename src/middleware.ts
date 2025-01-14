import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

// Rotas que requerem autenticação
const authRoutes = ['/portfolios', '/analises', '/ativos-recomendados', '/gpt']

// Rotas que requerem premium
const premiumRoutes = ['/gpt']

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  // Se não estiver autenticado e tentar acessar rota protegida
  if (!token && authRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Se estiver autenticado e tentar acessar login/register
  if (token && ['/login', '/register'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/portfolios', request.url))
  }

  // Verificar acesso premium
  if (token && premiumRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    // Verificar status da assinatura via API
    const response = await fetch(`${request.nextUrl.origin}/api/user/subscription`, {
      headers: {
        'Authorization': `Bearer ${token.sub}`,
        'Cookie': request.headers.get('cookie') || ''
      }
    })

    if (!response.ok) {
      return NextResponse.redirect(new URL('/upgrade', request.url))
    }

    const { isActive } = await response.json()
    if (!isActive) {
      return NextResponse.redirect(new URL('/upgrade', request.url))
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
    '/profile/:path*'
  ]
} 