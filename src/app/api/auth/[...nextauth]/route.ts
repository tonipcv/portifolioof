import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export const GET = handler
export const POST = handler

// Necessário para o App Router
export const runtime = 'nodejs'