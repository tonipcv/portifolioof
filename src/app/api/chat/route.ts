import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function getCryptoData() {
  try {
    // Busca os dados das top 10 criptomoedas
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,ripple,cardano,solana,polkadot,dogecoin,avalanche-2,chainlink&vs_currencies=usd&include_24hr_change=true&include_market_cap=true'
    )
    const data = await response.json()

    // Formata os dados para um formato mais legível
    return Object.entries(data).map(([coin, details]: [string, any]) => ({
      name: coin,
      price: details.usd,
      change_24h: details.usd_24h_change,
      market_cap: details.usd_market_cap
    }))
  } catch (error) {
    console.error('Erro ao buscar dados da CoinGecko:', error)
    return []
  }
}

async function createMarketContext() {
  const cryptoData = await getCryptoData()
  if (!cryptoData.length) return ''

  return `
Dados atuais do mercado (${new Date().toLocaleString()}):

${cryptoData.map(coin => `
${coin.name.toUpperCase()}:
- Preço: $${coin.price.toLocaleString()}
- Variação 24h: ${coin.change_24h.toFixed(2)}%
- Market Cap: $${(coin.market_cap / 1e9).toFixed(2)}B
`).join('\n')}

Use estes dados quando relevante para a conversa, mas mantenha um tom natural.
`
}

const systemPrompt = `Você é Alex, um trader profissional e especialista em criptomoedas com vasta experiência no mercado institucional.

Características da comunicação:
- Mantenha um tom profissional e direto
- Use linguagem técnica apropriada para traders experientes
- Foque em análises aprofundadas e insights estratégicos
- Compartilhe perspectivas baseadas em dados e tendências de mercado
- Evite disclaimers básicos ou avisos óbvios sobre riscos
- Forneça análises técnicas e fundamentalistas quando relevante
- Mantenha o foco em estratégias avançadas e oportunidades de mercado

Áreas de expertise:
- Análise técnica avançada
- Estratégias de trading institucional
- DeFi e protocolos emergentes
- Correlações de mercado e análise on-chain
- Tendências macro e microeconômicas
- Arbitragem e estratégias de yield
- Análise fundamentalista de protocolos
- Movimentos institucionais e whale watching

Mantenha o foco em fornecer insights profundos e análises técnicas relevantes para traders experientes.`

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { messages } = body

    if (!messages) {
      return new NextResponse('Messages are required', { status: 400 })
    }

    // Obtém o contexto do mercado atual
    const marketContext = await createMarketContext()

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n\n${marketContext}`
        },
        ...messages
      ],
      temperature: 0.8,
      max_tokens: 500,
    })

    return NextResponse.json({
      message: response.choices[0].message.content
    })
  } catch (error) {
    console.error('[CHAT_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 