import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp-pulse.com',
  port: 465,
  secure: true,
  auth: {
    user: 'xppsalvador@gmail.com',
    pass: 'k44o2egpLDaa7'
  }
})

interface SendMailOptions {
  to: string
  subject: string
  html: string
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  try {
    await transporter.sendMail({
      from: 'oi@k17.com.br',
      to,
      subject,
      html
    })
    return { success: true }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return { success: false, error }
  }
} 