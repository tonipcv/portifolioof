import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
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
            provider: true,
            whatsappVerified: true,
            whatsapp: true
          },
        });

        if (!user || !user?.password || user.provider === 'google') {
          throw new Error("Credenciais inválidas");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Credenciais inválidas");
        }

        // Atualizar provedor se ainda não estiver definido
        if (!user.provider) {
          await prisma.user.update({
            where: { id: user.id },
            data: { provider: 'credentials' }
          });
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
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false;
      }

      // Buscar usuário com informações completas
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: {
          id: true,
          whatsappVerified: true,
          provider: true,
          accounts: true
        }
      });

      // Se o usuário não existe no banco, permite criar (caso Google)
      if (!dbUser && account?.provider === "google") {
        // Criar usuário com whatsappVerified false
        await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name!,
            whatsappVerified: false,
            provider: "google"
          }
        });
        return `/verify?userId=${user.id}`;
      }

      // Se o usuário existe mas WhatsApp não está verificado
      if (dbUser && !dbUser.whatsappVerified) {
        return `/verify?userId=${dbUser.id}`;
      }

      if (account?.provider === "google") {
        // Se já existe conta Google vinculada, permite login
        if (dbUser?.accounts.some(acc => acc.provider === "google")) {
          return true;
        }

        // Se existe usuário com outro provedor, bloqueia
        if (dbUser?.provider && dbUser.provider !== "google") {
          return "/login?error=OAuthAccountNotLinked";
        }

        // Se existe usuário mas não tem provedor definido, vincula ao Google
        if (dbUser) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { provider: "google" }
          });
        }
      }

      return true;
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