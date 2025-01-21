import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas que requerem autenticação
const authRoutes = ['/portfolios', '/analises', '/ativos-recomendados', '/gpt']

// Rotas que requerem premium
const premiumRoutes = ['/gpt']

export default withAuth(
  async function middleware(request: NextRequest) {
    console.log('Middleware - Request URL:', request.nextUrl.pathname);

    // Se estiver autenticado e tentar acessar login/register
    if (['/login', '/register'].includes(request.nextUrl.pathname)) {
      console.log('Middleware - Redirecting to portfolios');
      return NextResponse.redirect(new URL('/portfolios', request.url))
    }

    // Verificar acesso premium
    if (premiumRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
      // @ts-ignore - o token tem a propriedade subscriptionStatus
      const isPremium = request.nextauth?.token?.subscriptionStatus === 'premium'
      
      if (!isPremium) {
        console.log('Middleware - Redirecting to pricing (not premium)');
        return NextResponse.redirect(new URL('/pricing', request.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        console.log('Middleware - Token:', token ? 'exists' : 'not found', 'Environment:', process.env.NODE_ENV);
        
        // Se a rota requer autenticação, verifica o token
        if (authRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
          return !!token
        }

        // Para outras rotas, permite o acesso
        return true
      }
    },
    pages: {
      signIn: '/login'
    }
  }
)

export const config = {
  matcher: [
    '/portfolios/:path*',
    '/ativos-recomendados/:path*',
    '/analises/:path*',
    '/gpt/:path*',
    '/profile/:path*',
    '/login',
    '/register'
  ]
} 