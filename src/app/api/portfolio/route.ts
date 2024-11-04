import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTopCryptos } from '@/lib/coingecko'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const portfolioId = searchParams.get('portfolioId')

  if (!portfolioId) {
    return NextResponse.json(
      { error: 'Portfolio ID is required' },
      { status: 400 }
    )
  }

  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: {
        id: portfolioId,
      },
      include: {
        cryptos: true,
      },
    })

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    // Get current prices from CoinGecko
    const prices = await getTopCryptos()
    
    // Calculate total invested
    const totalInvested = portfolio.cryptos.reduce((acc, crypto) => {
      return acc + (crypto.investedValue / 100) // Convert from cents
    }, 0)

    // Calculate portfolio value over time (mock data for now)
    const days = 30
    const values = Array.from({ length: days }, (_, i) => {
      const dayTotal = portfolio.cryptos.reduce((acc, crypto) => {
        const price = prices.find(p => p.id === crypto.coinId)
        if (!price) return acc
        // Add some random variation for historical prices
        const variation = 0.8 + Math.random() * 0.4
        return acc + (price.current_price * variation * crypto.amount)
      }, 0)
      return dayTotal
    })

    // Calculate current total value
    const totalValue = portfolio.cryptos.reduce((acc, crypto) => {
      const price = prices.find(p => p.id === crypto.coinId)
      if (!price) return acc
      return acc + (price.current_price * crypto.amount)
    }, 0)

    // Calculate profit/loss
    const profitLoss = totalValue - totalInvested
    const profitLossPercentage = (profitLoss / totalInvested) * 100

    // Calculate 24h change
    const change24h = ((values[values.length - 1] - values[values.length - 2]) / values[values.length - 2]) * 100

    return NextResponse.json({
      labels: Array.from({ length: days }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (days - i - 1))
        return date.toLocaleDateString('pt-BR')
      }),
      values,
      totalValue,
      totalInvested,
      profitLoss,
      profitLossPercentage,
      change24h,
    })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    )
  }
}