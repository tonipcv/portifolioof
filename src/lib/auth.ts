import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { User } from 'next-auth'

const production = process.env.NODE_ENV === 'production'
const baseUrl = 'https://app.cryph.ai'

// Log das variáveis de ambiente (sem expor valores sensíveis)
console.log('Environment Config:', {
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  baseUrl,
  production,
  hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
  hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  cookieDomain: production ? '.cryph.ai' : undefined
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() }
        })

        if (!user || !user.password) {
          throw new Error("Credenciais inválidas")
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error("Credenciais inválidas")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          whatsappVerified: user.whatsappVerified
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login'
  },
  cookies: {
    sessionToken: {
      name: `${production ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: production,
        domain: production ? '.cryph.ai' : undefined
      }
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log('Callback signIn:', { 
        email: user?.email,
        provider: account?.provider,
        whatsappVerified: user?.whatsappVerified
      });

      if (!user?.email) {
        console.log('Email não fornecido');
        return false;
      }

      try {
        if (account?.provider === "credentials") {
          return user.whatsappVerified === true;
        }

        if (account?.provider === "google") {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { whatsappVerified: true }
          });

          return dbUser?.whatsappVerified === true;
        }

        return false;
      } catch (error) {
        console.error('Erro no callback signIn:', error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/') || url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session.user }
      }
      
      if (user) {
        return {
          ...token,
          id: user.id,
          whatsappVerified: user.whatsappVerified
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          whatsappVerified: token.whatsappVerified as boolean
        }
      }
    }
  }
} 