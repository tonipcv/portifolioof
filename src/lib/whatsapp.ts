import https from 'https'

const ZAPI_INSTANCE = process.env.ZAPI_INSTANCE
const ZAPI_TOKEN = process.env.ZAPI_TOKEN
const ZAPI_CLIENT_TOKEN = process.env.ZAPI_CLIENT_TOKEN

// Verifica se as variáveis de ambiente estão definidas em produção
const isProduction = process.env.NODE_ENV === 'production'
if (isProduction && (!ZAPI_INSTANCE || !ZAPI_TOKEN || !ZAPI_CLIENT_TOKEN)) {
  console.error('Variáveis de ambiente Z-API não configuradas em produção')
}

export async function sendMessage(phone: string, message: string): Promise<any> {
  // Remove todos os caracteres não numéricos do telefone
  const cleanPhone = phone.replace(/\D/g, '')

  // Em desenvolvimento, apenas simula o envio
  if (!isProduction) {
    console.log('Simulando envio de mensagem em desenvolvimento:', { phone: cleanPhone, message })
    return Promise.resolve({ success: true })
  }

  // Em produção, verifica as variáveis de ambiente
  if (!ZAPI_INSTANCE || !ZAPI_TOKEN || !ZAPI_CLIENT_TOKEN) {
    throw new Error('Configuração do Z-API incompleta')
  }

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.z-api.io',
      port: 443,
      path: `/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`,
      method: 'POST',
      headers: {
        'client-token': ZAPI_CLIENT_TOKEN,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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
          
          if (res.statusCode !== 200 && res.statusCode !== 201) {
            reject(new Error(`Falha ao enviar mensagem: ${data}`))
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
      phone: cleanPhone,
      message: message
    }
    console.log('Dados da mensagem:', messageData)

    req.write(JSON.stringify(messageData))
    req.end()
  })
} 