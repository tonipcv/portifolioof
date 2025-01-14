import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Código é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar usuário pelo código de verificação
    const user = await prisma.user.findFirst({
      where: { verificationCode: code }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Código inválido' },
        { status: 404 }
      )
    }

    // Verificar se o código não expirou
    if (user.verificationCodeExpiry && user.verificationCodeExpiry < new Date()) {
      return NextResponse.json(
        { success: false, message: 'Código expirado' },
        { status: 400 }
      )
    }

    // Atualizar usuário como verificado
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationCode: null,
        verificationCodeExpiry: null
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Email confirmado com sucesso'
    })
  } catch (error) {
    console.error('Email confirmation error:', error)
    return NextResponse.json(
      { success: false, message: 'Erro ao confirmar email' },
      { status: 500 }
    )
  }
} 