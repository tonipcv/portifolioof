import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

console.log('NextAuth route handler initialized with config:', {
  secret: process.env.NEXTAUTH_SECRET ? 'set' : 'not set',
  url: process.env.NEXTAUTH_URL,
  googleId: process.env.GOOGLE_CLIENT_ID ? 'set' : 'not set',
  googleSecret: process.env.GOOGLE_CLIENT_SECRET ? 'set' : 'not set'
});

const handler = NextAuth(authOptions)

console.log('NextAuth handler created');

export { handler as GET, handler as POST }