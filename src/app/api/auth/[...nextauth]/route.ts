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

// Criar o handler do NextAuth com a configuração correta para App Router
const handler = NextAuth(authOptions)

// Exportar as funções com o tipo correto para App Router
export async function GET(request: Request) {
  // Extrair o path da URL para simular o query.nextauth
  const url = new URL(request.url)
  const nextauthPath = url.pathname.replace('/api/auth/', '')
  
  console.log('[Auth] GET request:', {
    path: nextauthPath,
    url: request.url,
    timestamp: new Date().toISOString()
  })

  return handler(request)
}

export async function POST(request: Request) {
  // Extrair o path da URL para simular o query.nextauth
  const url = new URL(request.url)
  const nextauthPath = url.pathname.replace('/api/auth/', '')
  
  console.log('[Auth] POST request:', {
    path: nextauthPath,
    url: request.url,
    timestamp: new Date().toISOString()
  })

  return handler(request)
}