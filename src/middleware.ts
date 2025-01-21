import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

// Rotas que requerem autenticação
const authRoutes = ['/portfolios', '/analises', '/ativos-recomendados', '/gpt']

// Rotas que requerem premium
const premiumRoutes = ['/gpt']

export async function middleware(request: NextRequest) {
  console.log('Middleware - Request URL:', request.nextUrl.pathname);
  
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
    cookieName: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token'
  });

  console.log('Middleware - Token:', token ? 'exists' : 'not found', 'Environment:', process.env.NODE_ENV);

  // Se não estiver autenticado e tentar acessar rota protegida
  if (!token && authRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    console.log('Middleware - Redirecting to login');
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Se estiver autenticado e tentar acessar login/register
  if (token && ['/login', '/register'].includes(request.nextUrl.pathname)) {
    console.log('Middleware - Redirecting to portfolios');
    return NextResponse.redirect(new URL('/portfolios', request.url))
  }

  // Verificar acesso premium
  if (token && premiumRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    // @ts-ignore - o token tem a propriedade subscriptionStatus
    const isPremium = token.subscriptionStatus === 'premium'
    
    if (!isPremium) {
      console.log('Middleware - Redirecting to pricing (not premium)');
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