import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            subscriptionStatus: true,
            whatsappVerified: true,
            whatsapp: true
          },
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
          subscriptionStatus: user.subscriptionStatus,
          whatsappVerified: user.whatsappVerified,
          whatsapp: user.whatsapp
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.subscriptionStatus = user.subscriptionStatus;
        token.whatsappVerified = user.whatsappVerified;
        token.whatsapp = user.whatsapp;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.subscriptionStatus = token.subscriptionStatus as string;
        session.user.whatsappVerified = token.whatsappVerified as boolean;
        session.user.whatsapp = token.whatsapp as string;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development'
} 