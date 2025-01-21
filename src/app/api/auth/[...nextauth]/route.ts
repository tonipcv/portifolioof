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
      url: request.url,
      pathname: new URL(request.url).pathname
    });
    
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      try {
        const clonedBody = await request.clone().text()
        const formData = new URLSearchParams(clonedBody)
        const jsonData = {
          email: formData.get('email'),
          password: formData.get('password'),
          redirect: formData.get('redirect'),
          callbackUrl: formData.get('callbackUrl') || '/portfolios',
          csrfToken: formData.get('csrfToken'),
          json: true
        }

        console.log('[Auth] Converted form data:', {
          hasEmail: !!jsonData.email,
          hasPassword: !!jsonData.password,
          redirect: jsonData.redirect,
          callbackUrl: jsonData.callbackUrl,
          timestamp: new Date().toISOString()
        });
        
        const newRequest = new Request(request.url, {
          method: request.method,
          duplex: 'half',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }),
          body: JSON.stringify(jsonData)
        } as ExtendedRequestInit)
        
        return NextAuth(authOptions)(newRequest)
      } catch (error) {
        console.error('[Auth] Error processing form data:', error)
        return new Response(
          JSON.stringify({ 
            error: 'CredentialsSignin',
            message: 'Invalid credentials'
          }),
          { 
            status: 401, 
            headers: { 'Content-Type': 'application/json' } 
          }
        )
      }
    }
    
    return NextAuth(authOptions)(request)
  } catch (error) {
    console.error('[Auth] Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'InternalServerError',
        message: 'An unexpected error occurred'
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