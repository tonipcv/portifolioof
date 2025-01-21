import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

async function handler(req: Request, context: { params: { nextauth: string[] } }) {
  const authHandler = NextAuth(authOptions);

  try {
    // Garantir que a resposta seja sempre um JSON válido
    const response = await authHandler(req, context);
    
    // Se a resposta for um Response object, retorná-lo diretamente
    if (response instanceof Response) {
      // Adicionar headers CORS para produção
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
      response.headers.set(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      );
      
      return response;
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
      JSON.stringify({ error: 'Internal server error', status: 'error' }),
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