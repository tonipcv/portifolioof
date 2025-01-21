import { NextAuthOptions, DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      subscriptionStatus?: string
      whatsappVerified?: boolean
      whatsapp?: string | null
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    subscriptionStatus?: string
    whatsappVerified?: boolean
    whatsapp?: string | null
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req): Promise<any> {
        if (!process.env.NEXTAUTH_SECRET) {
          console.error('NEXTAUTH_SECRET is not defined');
          throw new Error("Erro de configuração do servidor");
        }

        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email e senha são obrigatórios");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              subscriptionStatus: true,
              whatsappVerified: true,
              whatsapp: true
            }
          });

          if (!user || !user?.password) {
            throw new Error("Email não encontrado");
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isCorrectPassword) {
            throw new Error("Senha incorreta");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            subscriptionStatus: user.subscriptionStatus || 'free',
            whatsappVerified: user.whatsappVerified || false,
            whatsapp: user.whatsapp || null
          };
        } catch (error: any) {
          console.error('Authorize error:', error);
          throw new Error(error.message || "Erro ao autenticar usuário");
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 dias
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.subscriptionStatus = user.subscriptionStatus || 'free';
        token.whatsappVerified = user.whatsappVerified || false;
        token.whatsapp = user.whatsapp || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.subscriptionStatus = token.subscriptionStatus || 'free';
        session.user.whatsappVerified = token.whatsappVerified || false;
        session.user.whatsapp = token.whatsapp || null;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Forçar redirecionamento para login após signOut
      if (url.includes('signout')) {
        return `${baseUrl}/login`;
      }
      // Permitir redirecionamentos para URLs do mesmo domínio ou relativas
      if (url.startsWith(baseUrl) || url.startsWith('/')) {
        return url;
      }
      // Caso contrário, redirecionar para a página inicial
      return baseUrl;
    }
  },
  events: {
    async signOut({ session, token }) {
      try {
        console.log('User signed out:', session?.user?.email);
      } catch (error) {
        console.error('Error during signOut:', error);
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
} 