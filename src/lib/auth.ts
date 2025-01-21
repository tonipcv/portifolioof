import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const production = process.env.NODE_ENV === 'production'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
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
          throw new Error("Credenciais inválidas");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            whatsappVerified: true
          }
        });

        if (!user || !user.password) {
          throw new Error("Credenciais inválidas");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Credenciais inválidas");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          whatsappVerified: user.whatsappVerified
        };
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login'
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email) {
        return false;
      }

      // Login com credenciais (email/senha) não precisa de WhatsApp verificado
      if (account?.provider === "credentials") {
        return true;
      }

      // Apenas login com Google precisa de WhatsApp verificado
      if (account?.provider === "google") {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { whatsappVerified: true }
        });

        return dbUser?.whatsappVerified === true;
      }

      return false;
    },
    async jwt({ token, user }) {
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