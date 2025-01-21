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
  try {
    const contentType = request.headers.get('content-type')
    
    console.log('[Auth] Processing request:', {
      method: request.method,
      contentType,
      url: request.url
    })

    // Se for form-urlencoded, converter para JSON
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData()
      const jsonData = {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: formData.get('redirect'),
        callbackUrl: formData.get('callbackUrl'),
        json: true
      }

      console.log('[Auth] Converting form data to JSON:', {
        hasEmail: !!jsonData.email,
        hasPassword: !!jsonData.password,
        timestamp: new Date().toISOString()
      })

      // Criar nova request com dados em JSON
      const newRequest = new Request(request.url, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData),
        duplex: 'half'
      } as ExtendedRequestInit)

      return NextAuth(authOptions)(newRequest)
    }

    // Se já for JSON ou outro formato, passar direto
    return NextAuth(authOptions)(request)
  } catch (error) {
    console.error('[Auth] Error processing request:', error)
    return new Response(
      JSON.stringify({ 
        error: 'InternalServerError',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export const GET = auth
export const POST = auth