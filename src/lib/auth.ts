import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        try {
          console.log('Starting authorization attempt');
          
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials:', { email: !!credentials?.email, password: !!credentials?.password });
            throw new Error("Email e senha são obrigatórios");
          }

          console.log('Finding user in database');
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
              provider: true,
              whatsappVerified: true,
              whatsapp: true
            },
          });

          console.log('Database query result:', {
            userFound: !!user,
            hasPassword: !!user?.password,
            email: credentials.email
          });

          if (!user || !user?.password) {
            throw new Error("Email não encontrado");
          }

          console.log('Comparing passwords');
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log('Password verification result:', {
            isCorrectPassword,
            passwordLength: credentials.password.length,
            hashedLength: user.password.length
          });

          if (!isCorrectPassword) {
            throw new Error("Senha incorreta");
          }

          console.log('Authorization successful, returning user data');
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            subscriptionStatus: user.subscriptionStatus,
            whatsappVerified: user.whatsappVerified,
            whatsapp: user.whatsapp
          };
        } catch (error) {
          console.error('Authorization error:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
          });
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Para login com credenciais
        if (!user.email) {
          return false;
        }

        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: {
            id: true,
            whatsappVerified: true
          }
        });

        if (!dbUser?.whatsappVerified) {
          return `/verify?userId=${dbUser?.id}`;
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: {
            id: true,
            subscriptionStatus: true,
            emailVerified: true,
            whatsappVerified: true,
            whatsapp: true
          }
        });

        token.id = dbUser?.id;
        token.subscriptionStatus = dbUser?.subscriptionStatus;
        token.emailVerified = dbUser?.emailVerified;
        token.whatsappVerified = dbUser?.whatsappVerified;
        token.whatsapp = dbUser?.whatsapp;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.subscriptionStatus = token.subscriptionStatus as string;
        session.user.emailVerified = token.emailVerified as Date | null;
        session.user.whatsappVerified = token.whatsappVerified as boolean;
        session.user.whatsapp = token.whatsapp as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login'
  },
  debug: process.env.NODE_ENV === 'development'
} 