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

// Criar o handler do NextAuth
const handler = NextAuth(authOptions)

// Exportar as funções com o tipo correto para App Router
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const nextauthParams = Object.fromEntries(searchParams.entries())
  
  console.log('[Auth] GET request:', {
    url: req.url,
    params: nextauthParams,
    timestamp: new Date().toISOString()
  })

  try {
    const response = await handler(req)
    console.log('[Auth] GET response:', {
      status: response.status,
      timestamp: new Date().toISOString()
    })
    return response
  } catch (error) {
    console.error('[Auth] GET error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const nextauthParams = Object.fromEntries(searchParams.entries())
  
  console.log('[Auth] POST request:', {
    url: req.url,
    params: nextauthParams,
    timestamp: new Date().toISOString()
  })

  try {
    const response = await handler(req)
    console.log('[Auth] POST response:', {
      status: response.status,
      timestamp: new Date().toISOString()
    })
    return response
  } catch (error) {
    console.error('[Auth] POST error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}