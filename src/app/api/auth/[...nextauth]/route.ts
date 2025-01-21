import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Log detalhado da inicialização
console.log('NextAuth route handler initialized with config:', {
  secret: process.env.NEXTAUTH_SECRET ? 'set' : 'not set',
  url: process.env.NEXTAUTH_URL,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  googleId: process.env.GOOGLE_CLIENT_ID ? 'set' : 'not set',
  googleSecret: process.env.GOOGLE_CLIENT_SECRET ? 'set' : 'not set',
  env: process.env.NODE_ENV,
  baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXTAUTH_URL,
  production: process.env.NODE_ENV === 'production'
})

interface ExtendedRequestInit extends RequestInit {
  duplex?: 'half'
}

async function auth(request: Request) {
  const contentType = request.headers.get('content-type')
  
  console.log('[Auth] Processing request:', {
    method: request.method,
    contentType,
    url: request.url
  });
  
  if (contentType?.includes('application/x-www-form-urlencoded')) {
    try {
      // Criar uma cópia da request para não modificar a original
      const clonedBody = await request.clone().text()
      
      // Converter form-urlencoded para objeto
      const formData = new URLSearchParams(clonedBody)
      const jsonData = {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: formData.get('redirect'),
        callbackUrl: formData.get('callbackUrl'),
        csrfToken: formData.get('csrfToken'),
        json: true
      }

      console.log('[Auth] Converted form data:', {
        hasEmail: !!jsonData.email,
        hasPassword: !!jsonData.password,
        redirect: jsonData.redirect,
        callbackUrl: jsonData.callbackUrl
      });
      
      // Criar nova request com dados em JSON
      const newRequest = new Request(request.url, {
        method: request.method,
        duplex: 'half',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(jsonData)
      } as ExtendedRequestInit)
      
      return NextAuth(authOptions)(newRequest)
    } catch (error) {
      console.error('[Auth] Error processing form data:', error)
      return new Response(
        JSON.stringify({ error: 'Invalid request format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }
  
  return NextAuth(authOptions)(request)
}

export const GET = auth
export const POST = auth