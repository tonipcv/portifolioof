import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

console.log('NextAuth route handler initialized with config:', {
  secret: process.env.NEXTAUTH_SECRET ? 'set' : 'not set',
  url: process.env.NEXTAUTH_URL,
  googleId: process.env.GOOGLE_CLIENT_ID ? 'set' : 'not set',
  googleSecret: process.env.GOOGLE_CLIENT_SECRET ? 'set' : 'not set'
});

// Função auxiliar para parsear o corpo da requisição
async function parseRequest(req: Request) {
  try {
    const contentType = req.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await req.json();
    } else {
      const formData = await req.formData();
      const obj: Record<string, any> = {};
      for (const [key, value] of formData.entries()) {
        obj[key] = value;
      }
      return obj;
    }
  } catch (error) {
    console.error('Error parsing request:', error);
    return null;
  }
}

const handler = NextAuth({
  ...authOptions,
  callbacks: {
    ...authOptions.callbacks,
    async signIn(params) {
      try {
        console.log('SignIn callback params:', params);
        return await authOptions.callbacks?.signIn?.(params) ?? true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    }
  }
});

console.log('NextAuth handler created');

export async function POST(req: Request) {
  console.log('Received auth request:', {
    method: req.method,
    contentType: req.headers.get('content-type'),
    url: req.url
  });

  try {
    const response = await handler(req);
    console.log('Auth response:', {
      status: response.status,
      ok: response.ok
    });
    return response;
  } catch (error) {
    console.error('Auth error:', error);
    throw error;
  }
}

export { handler as GET }