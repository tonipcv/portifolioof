import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

async function handler(req: Request, context: { params: { nextauth: string[] } }) {
  // Verificar se é uma requisição OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT',
        'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      }
    });
  }

  // Log para debug
  console.log('Auth request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  try {
    const authHandler = NextAuth(authOptions);
    const response = await authHandler(req, context);

    // Log para debug
    console.log('Auth response:', {
      status: response instanceof Response ? response.status : 'not a Response',
      headers: response instanceof Response ? Object.fromEntries(response.headers.entries()) : 'not a Response'
    });

    if (response instanceof Response) {
      // Se for uma resposta de redirecionamento, retornar como está
      if (response.status === 302 || response.status === 301) {
        return response;
      }

      // Para outras respostas, garantir que os headers CORS estejam presentes
      const headers = new Headers(response.headers);
      headers.set('Access-Control-Allow-Credentials', 'true');
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
      headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

      // Tentar ler e retornar o corpo da resposta
      try {
        const body = await response.text();
        return new Response(body, {
          status: response.status,
          headers
        });
      } catch (error) {
        console.error('Error reading response body:', error);
        return response;
      }
    }

    // Se não for um Response, converter para JSON
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT',
        'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      }
    });
  } catch (error) {
    console.error('Auth handler error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        status: 'error' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT',
          'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        }
      }
    );
  }
}

export const runtime = 'nodejs';
export const GET = handler;
export const POST = handler; 