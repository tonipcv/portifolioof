import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTopCryptos } from '@/lib/binance'

function generateHistoricalData(baseValue: number, days: number) {
  const data = []
  const volatility = 0.02 // 2% volatility
  let currentValue = baseValue

  for (let i = 0; i < days; i++) {
    // Add some realistic market movement simulation
    const trend = Math.sin(i / 10) * volatility // Adds a slight trend
    const randomWalk = (Math.random() - 0.5) * volatility // Random movement
    const dailyReturn = 1 + trend + randomWalk
    
    currentValue = currentValue * dailyReturn
    data.push(currentValue)
  }

  return data
}

function getDaysForPeriod(period: string): number {
  switch (period) {
    case '1d':
      return 24  // 24 points for a day
    case '1w':
      return 7   // 7 days
    case '1m':
      return 30  // 30 days
    case '1y':
      return 365 // 365 days
    case 'all':
      return 730 // 2 years
    default:
      return 7
  }
}

function generateLabels(period: string, days: number) {
  const labels = []
  const now = new Date()

  if (period === '1d') {
    // Generate hourly labels for 1 day
    for (let i = 0; i < 24; i++) {
      const date = new Date(now)
      date.setHours(date.getHours() - (23 - i))
      labels.push(date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    }
  } else {
    // Generate daily labels for other periods
    for (let i = 0; i < days; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() - (days - 1 - i))
      
      if (days <= 7) {
        // Show weekday for weekly view
        labels.push(date.toLocaleDateString('pt-BR', { weekday: 'short' }))
      } else if (days <= 30) {
        // Show day and month for monthly view
        labels.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }))
      } else {
        // Show month and year for yearly view
        labels.push(date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }))
      }
    }
  }

  return labels
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const portfolioId = searchParams.get('portfolioId')
    const period = searchParams.get('period') || '1w'

    if (!portfolioId) {
      return NextResponse.json(
        { error: 'Portfolio ID is required' },
        { status: 400 }
      )
    }

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

    if (portfolio.cryptos.length === 0) {
      return NextResponse.json({
        labels: [],
        values: [],
        totalValue: 0,
        totalInvested: 0,
        profitLoss: 0,
        profitLossPercentage: 0,
        change24h: 0,
        period,
      })
    }

    // Get current prices
    const currentPrices = await getTopCryptos()
    
    // Calculate total invested and current value
    const totalInvested = portfolio.cryptos.reduce((acc, crypto) => {
      return acc + (crypto.investedValue / 100)
    }, 0)

    const totalValue = portfolio.cryptos.reduce((acc, crypto) => {
      const price = currentPrices.find(p => p.id === crypto.coinId)
      if (!price) return acc
      return acc + (price.current_price * crypto.amount)
    }, 0)

    // Generate historical data
    const days = getDaysForPeriod(period)
    const values = generateHistoricalData(totalValue, days)
    const labels = generateLabels(period, days)

    // Calculate metrics
    const profitLoss = totalValue - totalInvested
    const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0
    const change24h = ((values[values.length - 1] - values[values.length - 2]) / values[values.length - 2]) * 100

    return NextResponse.json({
      labels,
      values,
      totalValue,
      totalInvested,
      profitLoss,
      profitLossPercentage,
      change24h,
      period,
    })
  } catch (error) {
    console.error('Detailed error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch portfolio data' },
      { status: 500 }
    )
  }
}