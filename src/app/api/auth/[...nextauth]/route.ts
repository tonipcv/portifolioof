import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

console.log('NextAuth route handler initialized with config:', {
  secret: process.env.NEXTAUTH_SECRET ? 'set' : 'not set',
  url: process.env.NEXTAUTH_URL,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  googleId: process.env.GOOGLE_CLIENT_ID ? 'set' : 'not set',
  googleSecret: process.env.GOOGLE_CLIENT_SECRET ? 'set' : 'not set',
  env: process.env.NODE_ENV,
  baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXTAUTH_URL
});

const handler = NextAuth(authOptions)

// Usando o handler diretamente para GET e POST
export { handler as GET, handler as POST }