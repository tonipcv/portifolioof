import https from 'https'

const ZAPI_INSTANCE = process.env.ZAPI_INSTANCE
const ZAPI_TOKEN = process.env.ZAPI_TOKEN
const ZAPI_CLIENT_TOKEN = process.env.ZAPI_CLIENT_TOKEN

if (!ZAPI_INSTANCE || !ZAPI_TOKEN || !ZAPI_CLIENT_TOKEN) {
  throw new Error('Variáveis de ambiente ZAPI_INSTANCE, ZAPI_TOKEN e ZAPI_CLIENT_TOKEN são obrigatórias')
}

export async function sendMessage(phone: string, message: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.z-api.io',
      port: 443,
      path: `/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-messages`,
      method: 'POST',
      headers: {
        'client-token': ZAPI_CLIENT_TOKEN,
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
      phone,
      message
    }
    console.log('Dados da mensagem:', messageData)

    req.write(JSON.stringify(messageData))
    req.end()
  })
} 