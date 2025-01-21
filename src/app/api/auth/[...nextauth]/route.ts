import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const auth = NextAuth(authOptions)

export const GET = auth
export const POST = auth

// Necessário para o App Router
export const runtime = 'nodejs'