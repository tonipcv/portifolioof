import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
    // Retornar um array vazio por enquanto, já que o endpoint de notícias está instável
    return []
    
    // Quando o endpoint estiver estável, podemos voltar com este código:
    /*
    const response = await fetch(
      'https://api.coingecko.com/api/v3/news',
      {
        headers: {
          'accept': 'application/json'
        }
      }
    )
    const data = await response.json()
    
    if (!Array.isArray(data)) {
      console.log('Formato de resposta inválido:', data)
      return []
    }

    return data.slice(0, 5).map((news: any) => ({
      title: news.title,
      description: news.description,
      url: news.url,
      date: new Date(news.published_at).toLocaleString(),
      published_at: news.published_at
    }))
    */
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

// Função para buscar cotação do dólar
async function getUSDToBRL(): Promise<number> {
  try {
    const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL')
    const data = await response.json()
    return parseFloat(data.USDBRL.bid)
  } catch (error) {
    console.error('Error fetching USD to BRL rate:', error)
    return 5.00 // Valor fallback caso a API falhe
  }
}

// Função para formatar valores em BRL
function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

async function createMarketContext(userId: string): Promise<string> {
  const [cryptoData, newsData, userPortfolios, usdToBRL] = await Promise.all([
    getCryptoData(),
    getCryptoNews(),
    getUserPortfolios(userId),
    getUSDToBRL()
  ])

  const priceContext = cryptoData.length ? `
Dados atuais do mercado (${new Date().toLocaleString()}):

${cryptoData.map(coin => `
${coin.name.toUpperCase()}:
- Preço: **${formatBRL(coin.price * usdToBRL)}**
- Variação 24h: **${coin.change_24h.toFixed(2)}%**
- Market Cap: **${formatBRL((coin.market_cap * usdToBRL) / 1e9)}B**
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
- Valor Total: **${formatBRL(portfolio.totalValue * usdToBRL)}**
- Lucro/Prejuízo: **${formatBRL(portfolio.totalProfit * usdToBRL)}**

Ativos:
${portfolio.cryptos.map(crypto => `
${crypto.name} (${crypto.symbol.toUpperCase()})
- Quantidade: **${crypto.amount.toFixed(4)}**
- Preço Médio: **${formatBRL(crypto.averagePrice * usdToBRL)}**
- Preço Atual: **${formatBRL(crypto.currentPrice * usdToBRL)}**
- Lucro/Prejuízo: **${formatBRL(crypto.profit * usdToBRL)}**
`).join('\n')}
`).join('\n')}
` : 'O usuário ainda não possui portfólios.'

  return formatBoldText(`
${portfolioContext}

${priceContext}
${newsData.length ? `\n${newsContext}` : ''}

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

    const { messages, conversationId } = await req.json()

    if (!messages) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    const marketContext = await createMarketContext(session.user.id)

    // Recupera ou cria uma nova conversa
    let conversation
    try {
      if (conversationId) {
        conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
          include: { messages: true }
        })

        if (!conversation || conversation.userId !== session.user.id) {
          return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
        }
      } else {
        // Cria uma nova conversa
        conversation = await prisma.conversation.create({
          data: {
            userId: session.user.id,
            title: messages[0]?.content?.slice(0, 100) || 'Nova conversa',
          }
        })
      }
    } catch (error) {
      console.error('[CONVERSATION_ERROR]', error)
      return NextResponse.json({ error: 'Error managing conversation' }, { status: 500 })
    }

    try {
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

      const assistantMessage = response.choices[0].message.content || 'Desculpe, não consegui processar sua mensagem.'

      // Salva as mensagens no banco de dados
      await prisma.message.createMany({
        data: [
          {
            conversationId: conversation.id,
            role: 'user',
            content: messages[messages.length - 1].content
          },
          {
            conversationId: conversation.id,
            role: 'assistant',
            content: assistantMessage
          }
        ]
      })

      return NextResponse.json({
        role: 'assistant',
        content: formatBoldText(assistantMessage),
        conversationId: conversation.id
      })
    } catch (error) {
      console.error('[OPENAI_ERROR]', error)
      return NextResponse.json({ error: 'Error generating response' }, { status: 500 })
    }
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