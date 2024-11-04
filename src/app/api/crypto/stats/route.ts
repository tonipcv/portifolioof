import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: 1 },
      include: {
        cryptos: true
      }
    })

    if (!portfolio || !portfolio.cryptos.length) {
      return NextResponse.json({
        totalInvested: 0,
        currentValue: 0,
        totalProfit: 0,
        profitPercentage: 0
      })
    }

    const stats = portfolio.cryptos.reduce((acc, crypto) => {
      const invested = crypto.amount * crypto.buyPrice
      const current = crypto.amount * crypto.currentPrice
      const profit = current - invested

      return {
        totalInvested: acc.totalInvested + invested,
        currentValue: acc.currentValue + current,
        totalProfit: acc.totalProfit + profit,
      }
    }, {
      totalInvested: 0,
      currentValue: 0,
      totalProfit: 0,
    })

    const profitPercentage = (stats.totalProfit / stats.totalInvested) * 100

    return NextResponse.json({
      ...stats,
      profitPercentage
    })
  } catch (error) {
    console.error('Error calculating stats:', error)
    return NextResponse.json(
      { error: 'Failed to calculate portfolio statistics' },
      { status: 500 }
    )
  }
}