import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const production = process.env.NODE_ENV === 'production'

// Função auxiliar para logs detalhados
const logError = (stage: string, error: any, context?: any) => {
  console.error(`[${new Date().toISOString()}] Auth Error at ${stage}:`, {
    error: {
      message: error.message,
      name: error.name,
      stack: production ? error.stack : undefined
    },
    context,
    environment: {
      nodeEnv: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      production
    }
  })
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  debug: true, // Sempre habilitar logs para diagnóstico
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
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
      async authorize(credentials, req) {
        try {
          // Log do início da autorização
          console.log('[Auth] Starting authorization:', { 
            email: credentials?.email,
            hasPassword: !!credentials?.password,
            timestamp: new Date().toISOString(),
            production: process.env.NODE_ENV === 'production'
          })

          // Validação dos campos
          if (!credentials?.email || !credentials?.password) {
            const error = new Error("Email e senha são obrigatórios");
            logError('authorize/validation', error, {
              email: credentials?.email,
              hasPassword: !!credentials?.password,
              timestamp: new Date().toISOString()
            });
            throw error;
          }

          // Buscar usuário
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              whatsappVerified: true
            }
          }).catch(error => {
            logError('authorize/database', error, {
              email: credentials?.email,
              timestamp: new Date().toISOString()
            });
            throw new Error(`Erro ao buscar usuário: ${error.message}`);
          });

          // Verificar se usuário existe
          if (!user || !user.password) {
            const error = new Error("Email ou senha incorretos");
            logError('authorize/user-check', error, {
              email: credentials.email,
              userExists: !!user,
              hasPassword: !!user?.password,
              timestamp: new Date().toISOString()
            });
            throw error;
          }

          // Verificar senha
          const isValid = await bcrypt.compare(credentials.password, user.password)
            .catch(error => {
              logError('authorize/bcrypt', error, {
                email: user.email,
                timestamp: new Date().toISOString()
              });
              throw new Error(`Erro ao verificar senha: ${error.message}`);
            });

          if (!isValid) {
            const error = new Error("Email ou senha incorretos");
            logError('authorize/password-check', error, {
              email: user.email,
              userId: user.id,
              timestamp: new Date().toISOString()
            });
            throw error;
          }

          // Log de sucesso
          console.log('[Auth] Login successful:', { 
            email: user.email,
            userId: user.id,
            whatsappVerified: user.whatsappVerified,
            timestamp: new Date().toISOString()
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            whatsappVerified: user.whatsappVerified
          };
        } catch (error: any) {
          logError('authorize', error, {
            email: credentials?.email,
            errorMessage: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
          });
          // Propagar o erro original em vez de criar um novo
          throw error;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login'
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log('[Auth] Redirect callback:', { url, baseUrl });
      // Se a URL for relativa, adiciona o baseUrl
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Se a URL for do mesmo domínio, permite
      else if (url.startsWith(baseUrl)) {
        return url;
      }
      // Caso contrário, redireciona para a página inicial
      return baseUrl;
    },
    async signIn({ user, account }) {
      try {
        console.log('[Auth] SignIn callback started:', {
          provider: account?.provider,
          email: user?.email,
          timestamp: new Date().toISOString()
        })

        if (!user?.email) {
          logError('signIn/validation', new Error('No email provided'), {
            provider: account?.provider
          })
          return false
        }

        // Login com credenciais (email/senha) não precisa de WhatsApp verificado
        if (account?.provider === "credentials") {
          console.log('[Auth] Credentials provider login successful')
          return true
        }

        // Apenas login com Google precisa de WhatsApp verificado
        if (account?.provider === "google") {
          console.log('[Auth] Processing Google login')
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { whatsappVerified: true }
          })

          if (!dbUser?.whatsappVerified) {
            logError('signIn/google', new Error('WhatsApp not verified'), {
              email: user.email,
              provider: 'google'
            })
          }

          return dbUser?.whatsappVerified === true
        }

        logError('signIn/provider', new Error('Unknown provider'), {
          provider: account?.provider
        })
        return false
      } catch (error: any) {
        logError('signIn', error, {
          email: user?.email,
          provider: account?.provider
        })
        return false
      }
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          return {
            ...token,
            id: user.id,
            whatsappVerified: user.whatsappVerified
          }
        }
        return token
      } catch (error: any) {
        logError('jwt', error, { tokenExists: !!token })
        return token
      }
    },
    async session({ session, token }) {
      try {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id as string,
            whatsappVerified: token.whatsappVerified as boolean
          }
        }
      } catch (error: any) {
        logError('session', error, { 
          sessionExists: !!session,
          tokenExists: !!token
        })
        return session
      }
    }
  }
} 