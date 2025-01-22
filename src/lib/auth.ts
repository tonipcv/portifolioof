import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

declare module 'next-auth' {
  interface User {
    id: string
    email: string | undefined
    name: string | undefined
    subscriptionStatus: string | undefined
  }
  
  interface Session {
    user: {
      id: string
      email: string | undefined
      name: string | undefined
      subscriptionStatus: string | undefined
    }
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!process.env.DATABASE_URL) {
          console.error('DATABASE_URL não está definida')
          return null
        }

        if (!credentials?.email || !credentials?.password) {
          console.error('Credenciais não fornecidas')
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !user.password) {
            console.error('Usuário não encontrado')
            return null
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) {
            console.error('Senha inválida')
            return null
          }

          return {
            id: user.id,
            email: user.email || undefined,
            name: user.name || undefined,
            subscriptionStatus: user.subscriptionStatus || undefined
          }
        } catch (error) {
          console.error('Erro de autenticação:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.user = {
          subscriptionStatus: user.subscriptionStatus
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email || undefined
        session.user.name = token.name || undefined
        session.user.subscriptionStatus = token.user?.subscriptionStatus || undefined
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
} 