import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendMessage } from '@/lib/whatsapp'

export async function POST(request: Request) {
  try {
    const { whatsapp, userId } = await request.json()
    console.log('POST - Recebido:', { whatsapp, userId })

    if (!whatsapp || !userId) {
      return NextResponse.json(
        { success: false, error: 'WhatsApp e userId são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar formato do WhatsApp
    const whatsappRegex = /^\+\d{12,}$/
    if (!whatsappRegex.test(whatsapp)) {
      return NextResponse.json(
        { success: false, error: 'Formato de WhatsApp inválido' },
        { status: 400 }
      )
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Gerar código
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Enviar código via WhatsApp
    const message = `Seu código de verificação é: ${code}\nEle expira em 5 minutos.`
    const phone = whatsapp.replace('+', '')
    await sendMessage(phone, message)

    return NextResponse.json({ 
      success: true,
      message: 'Código enviado com sucesso' 
    })
  } catch (error) {
    console.error('Erro ao enviar código:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { whatsapp, userId } = await request.json()
    console.log('PUT - Recebido:', { whatsapp, userId })

    // Atualizar usuário como verificado
    await prisma.user.update({
      where: { id: userId },
      data: {
        whatsapp,
        whatsappVerified: true
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'WhatsApp verificado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao verificar código:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
} 