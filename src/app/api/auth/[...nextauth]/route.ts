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

let handler;

try {
  handler = NextAuth(authOptions)
  console.log('NextAuth handler created successfully')
} catch (error) {
  console.error('Error creating NextAuth handler:', error)
  throw error
}

export { handler as GET, handler as POST }