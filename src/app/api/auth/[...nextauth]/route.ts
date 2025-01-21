import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Remover logs iniciais que podem interferir com o parsing da resposta
const handler = NextAuth(authOptions)

// Exportar o handler diretamente como GET e POST
export { handler as GET, handler as POST }