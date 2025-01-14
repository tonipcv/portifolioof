import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import https from 'https'
import { sendMail } from '@/lib/mail'

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
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { whatsapp }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: existingUser.email === email ? 'Email já cadastrado' : 'WhatsApp já cadastrado' 
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
    try {
      const formattedPhone = whatsapp.replace('+', '')
      
      // Debug: Verificar valores das variáveis de ambiente
      console.log('Verificando variáveis de ambiente Z-API:')
      console.log('ZAPI_INSTANCE:', typeof process.env.ZAPI_INSTANCE, process.env.ZAPI_INSTANCE ? '✓' : '✗')
      console.log('ZAPI_TOKEN:', typeof process.env.ZAPI_TOKEN, process.env.ZAPI_TOKEN ? '✓' : '✗')
      console.log('ZAPI_CLIENT_TOKEN:', typeof process.env.ZAPI_CLIENT_TOKEN, process.env.ZAPI_CLIENT_TOKEN ? '✓' : '✗')

      const envVars = {
        instance: process.env.ZAPI_INSTANCE,
        token: process.env.ZAPI_TOKEN,
        clientToken: process.env.ZAPI_CLIENT_TOKEN
      }

      // Verificar se todas as variáveis de ambiente estão definidas
      const missingVars = Object.entries(envVars)
        .filter(([_, value]) => !value)
        .map(([key]) => key)

      if (missingVars.length > 0) {
        throw new Error(`Variáveis de ambiente não configuradas: ${missingVars.join(', ')}`)
      }

      // Enviar código por email
      const emailHtml = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000000; color: #ffffff; padding: 32px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="K17" width="120" height="36" style="filter: brightness(0) invert(1);" />
          </div>

          <div style="background-color: rgba(24, 24, 27, 0.5); border: 1px solid rgba(39, 39, 42, 0.5); border-radius: 12px; padding: 32px; backdrop-filter: blur(8px);">
            <h1 style="color: #2dd4bf; text-align: center; font-size: 24px; font-weight: 300; margin-bottom: 24px;">
              Confirme seu número
            </h1>
            
            <div style="background-color: rgba(0, 0, 0, 0.2); border: 1px solid rgba(39, 39, 42, 0.5); padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0;">
              <input style="background: transparent; border: none; color: #ffffff; font-size: 32px; font-weight: 300; letter-spacing: 0.75em; text-align: center; width: 100%; outline: none;" value="${verificationCode}" readonly>
            </div>
            
            <p style="color: #71717a; font-size: 14px; text-align: center; margin-top: 12px;">
              Digite o código de 6 dígitos enviado para seu WhatsApp
            </p>

            <p style="color: #52525b; font-size: 12px; text-align: center; margin-top: 24px;">
              Este código expira em 15 minutos.
              <br>
              Se você não solicitou este código, por favor ignore este email.
            </p>
          </div>
        </div>
      `

      await sendMail({
        to: email,
        subject: 'Confirme seu número - K17',
        html: emailHtml
      })

      // Criar uma Promise para lidar com a requisição http
      const sendWhatsApp = () => new Promise((resolve, reject) => {
        const options = {
          hostname: 'api.z-api.io',
          port: 443, // Porta padrão para HTTPS
          path: `/instances/${envVars.instance}/token/${envVars.token}/send-messages`,
          method: 'POST',
          headers: {
            'client-token': envVars.clientToken,
            'Content-Type': 'application/json'
          }
        }

        console.log('Endpoint:', `https://${options.hostname}${options.path}`)

        const req = https.request(options, (res) => {
          let data = ''

          res.on('data', (chunk) => {
            data += chunk
          })

          res.on('end', () => {
            console.log('Status da resposta:', res.statusCode)
            try {
              const jsonResponse = JSON.parse(data)
              console.log('Resposta Z-API:', jsonResponse)
              
              if (res.statusCode !== 200) {
                reject(new Error(`Falha ao enviar código de verificação: ${data}`))
              } else {
                resolve(jsonResponse)
              }
            } catch (error) {
              reject(new Error(`Erro ao processar resposta: ${data}`))
            }
          })
        })

        req.on('error', (error) => {
          console.error('Erro na requisição:', error)
          reject(error)
        })

        const messageData = {
          phone: formattedPhone,
          message: `Seu código de verificação é: *${verificationCode}*\nEste código expira em 15 minutos.`
        }
        console.log('Dados da mensagem:', messageData)

        req.write(JSON.stringify(messageData))
        req.end()
      })

      await sendWhatsApp()

      return NextResponse.json({
        success: true,
        message: 'Código de verificação enviado para seu WhatsApp e Email'
      })
    } catch (error) {
      console.error('Erro ao enviar código:', error)
      
      // Se falhar ao enviar o código, deletar o usuário e retornar erro
      await prisma.user.delete({ where: { id: user.id } })
      
      return NextResponse.json(
        { success: false, message: 'Erro ao enviar código de verificação. Por favor, tente novamente.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Erro ao registrar usuário' },
      { status: 500 }
    )
  }
} 