import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Função para buscar cotação do dólar
async function getUSDToBRL() {
  try {
    const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL')
    const data = await response.json()
    return parseFloat(data.USDBRL.bid)
  } catch (error) {
    console.error('Error fetching USD to BRL rate:', error)
    return 5.00 // Valor fallback caso a API falhe
  }
}

export async function GET(
  request: Request,
  { params }: { params: { portfolioId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Buscar a cotação do dólar
    const usdToBRL = await getUSDToBRL()

    // Buscar o portfólio e suas criptomoedas
    const portfolio = await prisma.portfolio.findUnique({
      where: { 
        id: params.portfolioId,
        userId: session.user.id
      },
      include: { cryptos: true }
    })

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }

    // Converter valores para BRL
    const cryptosInBRL = portfolio.cryptos.map(crypto => ({
      ...crypto,
      currentPrice: crypto.currentPrice * usdToBRL,
      investedValue: crypto.investedValue * usdToBRL,
      profit: crypto.profit * usdToBRL,
      averagePrice: crypto.averagePrice * usdToBRL,
      marketCap: crypto.marketCap ? crypto.marketCap * usdToBRL : null,
      totalVolume: crypto.totalVolume ? crypto.totalVolume * usdToBRL : null
    }))

    return NextResponse.json({ data: cryptosInBRL })
  } catch (error) {
    console.error('Error fetching portfolio cryptos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio cryptos' },
      { status: 500 }
    )
  }
} 