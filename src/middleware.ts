import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';

export default async function middleware(req: NextRequestWithAuth) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');

  // Rotas que requerem autenticação
  const protectedRoutes = [
    '/portfolios',
    '/profile',
  ];

  // Rotas que requerem assinatura premium
  const premiumRoutes = [
    '/cursos',           // Cursos
    '/analytics',         // Analytics avançado
    '/api/advanced',      // APIs avançadas
    '/portfolio-pro',     // Recursos avançados de portfólio
    '/signals',          // Sinais de trading
  ];

  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  const isPremiumRoute = premiumRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Redirecionar para login se tentar acessar rota protegida sem estar autenticado
  if (isProtectedRoute && !isAuth) {
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
  }

  // Verificar assinatura premium
  if (isPremiumRoute) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const userResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/user/subscription`, {
        headers: {
          Cookie: req.headers.get('cookie') || '',
        },
      });

      const userData = await userResponse.json();

      if (userData.subscriptionStatus !== 'premium') {
        return NextResponse.redirect(new URL('/pricing', req.url));
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      return NextResponse.redirect(new URL('/pricing', req.url));
    }
  }

  // Redirecionar para home se tentar acessar página de login já estando autenticado
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/portfolios/:path*',
    '/profile/:path*',
    '/cursos/:path*',
    '/analytics/:path*',
    '/api/advanced/:path*',
    '/portfolio-pro/:path*',
    '/signals/:path*',
    '/login'
  ]
}; 