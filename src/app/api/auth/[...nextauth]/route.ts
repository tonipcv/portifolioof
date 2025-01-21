import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth({
  ...authOptions,
  callbacks: {
    ...authOptions.callbacks,
    async jwt(params) {
      try {
        const { token, user } = params;
        if (user) {
          token.id = user.id;
          token.subscriptionStatus = user.subscriptionStatus;
          token.whatsappVerified = user.whatsappVerified;
          token.whatsapp = user.whatsapp;
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        return params.token;
      }
    },
    async session(params) {
      try {
        const { session, token } = params;
        if (session.user) {
          session.user.id = token.id as string;
          session.user.subscriptionStatus = token.subscriptionStatus as string;
          session.user.whatsappVerified = token.whatsappVerified as boolean;
          session.user.whatsapp = token.whatsapp as string;
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return params.session;
      }
    }
  }
})

export { handler as GET, handler as POST }