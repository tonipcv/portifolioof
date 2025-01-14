import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { code, email } = await request.json()

    if (!code || !email) {
      return NextResponse.json(
        { success: false, message: 'Código e email são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o código está correto e não expirou
    if (user.verificationCode !== code) {
      return NextResponse.json(
        { success: false, message: 'Código inválido' },
        { status: 400 }
      )
    }

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
      message: 'Email verificado com sucesso'
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Erro ao verificar email' },
      { status: 500 }
    )
  }
} 