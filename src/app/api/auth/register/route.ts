import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import https from 'https'
import { sendMail } from '@/lib/mail'
import { sendMessage } from '@/lib/whatsapp'

export async function POST(request: Request) {
  try {
    const { email, password, name, whatsapp } = await request.json()

    if (!email || !password || !name || !whatsapp) {
      return NextResponse.json(
        { success: false, message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email já cadastrado'
        },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Gerar código de verificação
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos

    // Criar usuário não verificado
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        whatsapp,
        verificationCode,
        verificationCodeExpiry,
        whatsappVerified: false
      }
    })

    // Enviar código via WhatsApp usando Z-API
    const message = `Seu código de verificação é: *${verificationCode}*\nEle expira em 15 minutos.`
    const phone = whatsapp.replace('+', '') // Remove o + para o Z-API
    await sendMessage(phone, message)

    return NextResponse.json({
      success: true,
      userId: user.id,
      message: 'Código de verificação enviado para seu WhatsApp'
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Erro ao registrar usuário' },
      { status: 500 }
    )
  }
} 