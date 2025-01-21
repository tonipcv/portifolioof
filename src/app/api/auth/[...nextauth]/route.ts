import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

async function handler(req: Request) {
  // Se for uma requisição OPTIONS, retornar 200 OK
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 })
  }

  try {
    const nextAuthHandler = await NextAuth(authOptions)
    const response = await nextAuthHandler(req)

    // Se for uma requisição de API (não um redirecionamento)
    if (req.headers.get('accept')?.includes('application/json')) {
      const responseBody = await response.text()
      
      try {
        // Tentar parsear o corpo da resposta
        const jsonResponse = JSON.parse(responseBody)
        return NextResponse.json(jsonResponse)
      } catch {
        // Se não for JSON válido, retornar o corpo como está
        return new NextResponse(responseBody, response)
      }
    }

    return response
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    )
  }
}

export { handler as GET, handler as POST }