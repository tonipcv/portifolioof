import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';

export default async function middleware(req: NextRequestWithAuth) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');
  const isCourseRoute = req.nextUrl.pathname.startsWith('/courses');

  if (isCourseRoute) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Verificar se o usuário é premium
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

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/courses/:path*', '/login']
}; 