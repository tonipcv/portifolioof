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

    // Valores padrão se não houver portfolio ou criptomoedas
    const defaultStats = {
      totalInvested: 0,
      currentValue: 0,
      totalProfit: 0,
      profitPercentage: 0
    }

    if (!portfolio || !portfolio.cryptos.length) {
      return NextResponse.json(defaultStats)
    }

    // Calcula os totais
    const totalInvested = portfolio.cryptos.reduce((sum, crypto) => 
      sum + (crypto.investedAmount || 0), 0
    )

    const currentValue = portfolio.cryptos.reduce((sum, crypto) => 
      sum + (crypto.amount * crypto.currentPrice), 0
    )

    const totalProfit = currentValue - totalInvested
    const profitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0

    return NextResponse.json({
      totalInvested,
      currentValue,
      totalProfit,
      profitPercentage
    })
  } catch (error) {
    console.error('Error calculating stats:', error)
    return NextResponse.json({
      totalInvested: 0,
      currentValue: 0,
      totalProfit: 0,
      profitPercentage: 0
    })
  } finally {
    await prisma.$disconnect()
  }
}