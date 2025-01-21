import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Não autorizado' },
        { status: 401 }
      )
    }

    const answers = await request.json()
    
    if (!answers) {
      return NextResponse.json(
        { success: false, message: 'Dados inválidos' },
        { status: 400 }
      )
    }
    
    // Log das respostas recebidas
    console.log('Respostas do onboarding:', {
      email: session.user.email,
      answers
    })

    // Buscar usuário antes da atualização
    const userBefore = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        level: true,
        exchange: true,
        traditional_investment: true,
        crypto_investment: true,
        discovery: true,
        onboardingCompleted: true
      }
    })

    console.log('Estado do usuário antes:', userBefore)

    // Atualizar usuário com as respostas do onboarding
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        level: answers.level,
        exchange: answers.exchange,
        traditional_investment: answers.traditional_investment,
        crypto_investment: answers.crypto_investment,
        discovery: answers.discovery,
        onboardingCompleted: true
      },
      select: {
        level: true,
        exchange: true,
        traditional_investment: true,
        crypto_investment: true,
        discovery: true,
        onboardingCompleted: true
      }
    })

    console.log('Estado do usuário depois:', updatedUser)

    return NextResponse.json({ 
      success: true,
      message: 'Dados salvos com sucesso',
      data: updatedUser
    })
  } catch (error: any) {
    console.error('Erro detalhado do onboarding:', error)
    
    return NextResponse.json(
      { success: false, message: 'Erro ao salvar respostas' },
      { status: 500 }
    )
  }
} 