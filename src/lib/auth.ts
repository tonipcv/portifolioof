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
      try {
        if (account?.provider === "google") {
          const googleEmail = profile?.email;
          
          console.log('SignIn callback - Google data:', { 
            googleEmail,
            profileEmail: profile?.email,
            userEmail: user?.email,
            profile,
            account
          });

          if (!googleEmail) {
            console.log('No Google email provided');
            return false;
          }

          // Primeiro, tentar encontrar usuário pelo email do Google
          let dbUser = await prisma.user.findUnique({
            where: { email: googleEmail },
            include: {
              accounts: true
            }
          });

          console.log('Found user by email:', dbUser);

          // Se não encontrou pelo email, procurar pela conta Google
          if (!dbUser) {
            const googleAccount = await prisma.account.findFirst({
              where: {
                provider: 'google',
                providerAccountId: account.providerAccountId
              },
              include: {
                user: {
                  include: {
                    accounts: true
                  }
                }
              }
            });

            console.log('Found Google account:', googleAccount);

            if (googleAccount) {
              dbUser = googleAccount.user;
              // Atualizar email se diferente
              if (dbUser.email !== googleEmail) {
                await prisma.user.update({
                  where: { id: dbUser.id },
                  data: { email: googleEmail }
                });
              }
            }
          }

          // Se o usuário não existe no banco, criar novo
          if (!dbUser) {
            console.log('Creating new user for Google account:', googleEmail);
            const newUser = await prisma.user.create({
              data: {
                email: googleEmail,
                name: profile?.name || user.name!,
                whatsappVerified: false,
                provider: "google"
              }
            });

            // Criar conta Google separadamente
            await prisma.account.create({
              data: {
                userId: newUser.id,
                type: account.type!,
                provider: account.provider!,
                providerAccountId: account.providerAccountId!,
                access_token: account.access_token!,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              }
            });

            console.log('Created new user:', newUser);
            return `/verify?userId=${newUser.id}`;
          }

          // Se o usuário existe mas WhatsApp não está verificado
          if (!dbUser.whatsappVerified) {
            console.log('User needs WhatsApp verification:', dbUser.email);
            return `/verify?userId=${dbUser.id}`;
          }

          // Se ainda não tem conta Google vinculada, vincular
          if (!dbUser.accounts.some(acc => acc.provider === "google")) {
            console.log('Linking Google account to existing user:', dbUser.email);
            await prisma.account.create({
              data: {
                userId: dbUser.id,
                type: account.type!,
                provider: account.provider!,
                providerAccountId: account.providerAccountId!,
                access_token: account.access_token!,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              }
            });
          }

          return true;
        }

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