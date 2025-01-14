import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendMessage } from '@/lib/whatsapp'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Gera um código de 6 dígitos
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const { whatsapp, userId } = await request.json()
    console.log('POST - Recebido:', { whatsapp, userId })

    if (!whatsapp || !userId) {
      return NextResponse.json(
        { error: 'WhatsApp e userId são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar formato do WhatsApp
    const whatsappRegex = /^\+\d{12,}$/
    if (!whatsappRegex.test(whatsapp)) {
      return NextResponse.json(
        { error: 'Formato de WhatsApp inválido' },
        { status: 400 }
      )
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Gerar código e data de expiração
    const code = generateCode()
    const verificationCodeExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutos

    // Armazenar código no banco
    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationCode: code,
        verificationCodeExpiry
      }
    })
    
    console.log('Código armazenado:', {
      whatsapp,
      code,
      expiresAt: verificationCodeExpiry
    })

    // Enviar código via WhatsApp usando Z-API
    const message = `Seu código de verificação é: ${code}\nEle expira em 5 minutos.`
    const phone = whatsapp.replace('+', '') // Remove o + para o Z-API
    await sendMessage(phone, message)

    return NextResponse.json({ message: 'Código enviado com sucesso' })
  } catch (error) {
    console.error('Erro ao enviar código:', error)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { code, whatsapp, userId } = await request.json()
    console.log('PUT - Recebido:', { code, whatsapp, userId })

    if (!code || !whatsapp || !userId) {
      return NextResponse.json(
        { error: 'Código, WhatsApp e userId são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar usuário e verificar código
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        verificationCode: true,
        verificationCodeExpiry: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    console.log('Dados armazenados:', {
      storedCode: user.verificationCode,
      expiresAt: user.verificationCodeExpiry,
      receivedCode: code
    })

    if (!user.verificationCode || user.verificationCode !== code) {
      return NextResponse.json(
        { error: 'Código inválido' },
        { status: 400 }
      )
    }

    // Verificar expiração
    if (!user.verificationCodeExpiry || new Date() > user.verificationCodeExpiry) {
      return NextResponse.json(
        { error: 'Código expirado' },
        { status: 400 }
      )
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        whatsapp,
        whatsappVerified: true,
        verificationCode: null,
        verificationCodeExpiry: null
      },
      select: {
        id: true,
        email: true,
        whatsappVerified: true,
        whatsapp: true
      }
    })

    // Atualizar sessão
    const session = await getServerSession(authOptions)
    if (session?.user) {
      session.user.whatsappVerified = true
      session.user.whatsapp = whatsapp
    }

    return NextResponse.json({ 
      success: true,
      message: 'WhatsApp verificado com sucesso',
      user: updatedUser
    })
  } catch (error) {
    console.error('Erro ao verificar código:', error)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
} 