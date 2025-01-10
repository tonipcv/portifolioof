import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CryptoData {
  name: string
  price: number
  change_24h: number
  market_cap: number
}

interface CryptoNews {
  title: string
  description: string
  url: string
  date: string
  published_at: string
}

interface UserPortfolio {
  name: string
  totalValue: number
  totalProfit: number
  cryptos: {
    name: string
    symbol: string
    amount: number
    investedValue: number
    currentPrice: number
    profit: number
    averagePrice: number
  }[]
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function getCryptoData(): Promise<CryptoData[]> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,ripple,cardano,solana,polkadot,dogecoin,avalanche-2,chainlink&vs_currencies=usd&include_24hr_change=true&include_market_cap=true'
    )
    const data = await response.json()

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

async function getCryptoNews(): Promise<CryptoNews[]> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/news'
    )
    const data = await response.json()
    
    return data.slice(0, 5).map((news: CryptoNews) => ({
      title: news.title,
      description: news.description,
      url: news.url,
      date: new Date(news.published_at).toLocaleString(),
      published_at: news.published_at
    }))
  } catch (error) {
    console.error('Erro ao buscar notícias da CoinGecko:', error)
    return []
  }
}

function formatBoldText(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

async function getUserPortfolios(userId: string): Promise<UserPortfolio[]> {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { userId },
      include: {
        cryptos: true
      }
    })

    return portfolios.map(portfolio => ({
      name: portfolio.name,
      totalValue: portfolio.totalValue,
      totalProfit: portfolio.totalProfit,
      cryptos: portfolio.cryptos.map(crypto => ({
        name: crypto.name || '',
        symbol: crypto.symbol || '',
        amount: crypto.amount,
        investedValue: crypto.investedValue,
        currentPrice: crypto.currentPrice,
        profit: crypto.profit,
        averagePrice: crypto.averagePrice
      }))
    }))
  } catch (error) {
    console.error('Erro ao buscar portfólios do usuário:', error)
    return []
  }
}

async function createMarketContext(userId: string): Promise<string> {
  const [cryptoData, newsData, userPortfolios] = await Promise.all([
    getCryptoData(),
    getCryptoNews(),
    getUserPortfolios(userId)
  ])

  const priceContext = cryptoData.length ? `
Dados atuais do mercado (${new Date().toLocaleString()}):

${cryptoData.map(coin => `
${coin.name.toUpperCase()}:
- Preço: **$${coin.price.toLocaleString()}**
- Variação 24h: **${coin.change_24h.toFixed(2)}%**
- Market Cap: **$${(coin.market_cap / 1e9).toFixed(2)}B**
`).join('\n')}
` : ''

  const newsContext = newsData.length ? `
Últimas notícias relevantes do mercado:

${newsData.map((news: CryptoNews) => `
📰 **${news.title}**
📅 ${news.date}
📝 ${news.description}
`).join('\n')}
` : ''

  const portfolioContext = userPortfolios.length ? `
Portfólios do usuário:

${userPortfolios.map(portfolio => `
📊 ${portfolio.name}
- Valor Total: **$${portfolio.totalValue.toLocaleString()}**
- Lucro/Prejuízo: **$${portfolio.totalProfit.toLocaleString()}**

Ativos:
${portfolio.cryptos.map(crypto => `
${crypto.name} (${crypto.symbol.toUpperCase()})
- Quantidade: **${crypto.amount.toFixed(4)}**
- Preço Médio: **$${crypto.averagePrice.toLocaleString()}**
- Preço Atual: **$${crypto.currentPrice.toLocaleString()}**
- Lucro/Prejuízo: **$${crypto.profit.toLocaleString()}**
`).join('\n')}
`).join('\n')}
` : 'O usuário ainda não possui portfólios.'

  return formatBoldText(`
${portfolioContext}

${priceContext}

${newsContext}

Use estas informações de mercado, portfólios do usuário e notícias quando relevante para a conversa, mantendo um tom analítico e profissional.
`)
}

const systemPrompt = `Você é Alex, um trader profissional e especialista em criptomoedas com vasta experiência no mercado institucional.

Diretrizes de comunicação:
- Seja conciso e direto nas respostas
- Use no máximo 2-3 frases por resposta
- Destaque números e dados importantes com **negrito**
- Mantenha análises curtas e objetivas
- Use linguagem técnica apropriada

Áreas de expertise:
- Análise técnica avançada
- Estratégias de trading institucional
- DeFi e protocolos emergentes
- Correlações de mercado e análise on-chain
- Tendências macro e microeconômicas
- Arbitragem e estratégias de yield
- Análise fundamentalista de protocolos
- Movimentos institucionais e whale watching

Conhecimentos específicos:
- DeFi (Finanças Descentralizadas)
- NFTs e Web3
- Análise técnica e fundamentalista
- Gestão de risco e portfolio
- Regulamentações e tendências do mercado
- Tecnologia blockchain e seus casos de uso
- Principais protocolos e tokens do mercado

Mantenha o foco em fornecer insights técnicos relevantes de forma direta e concisa.`

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.subscriptionStatus !== 'premium') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages } = await req.json()

    if (!messages) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    const marketContext = await createMarketContext(session.user.id)

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n\n${marketContext}`
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 150,
      presence_penalty: -0.5,
      frequency_penalty: 0.3
    })

    const content = response.choices[0].message.content || 'Desculpe, não consegui processar sua mensagem.'

    return NextResponse.json({
      role: 'assistant',
      content: formatBoldText(content)
    })
  } catch (error) {
    console.error('[CHAT_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 