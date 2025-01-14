import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { isActive: false, message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        subscriptionStatus: true,
        subscriptionEndDate: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { isActive: false, message: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const isActive = user.subscriptionStatus === 'active' && 
      (!user.subscriptionEndDate || new Date(user.subscriptionEndDate) > new Date())

    return NextResponse.json({ isActive })
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error)
    return NextResponse.json(
      { isActive: false, message: 'Erro ao verificar assinatura' },
      { status: 500 }
    )
  }
} 