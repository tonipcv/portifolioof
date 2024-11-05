import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Busca todas as criptomoedas do portfolio
    const cryptos = await prisma.crypto.findMany()
    
    // Atualiza cada criptomoeda
    for (const crypto of cryptos) {
      try {
        // Busca o preço atual da API
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${crypto.coinId.toLowerCase()}&vs_currencies=brl`
        )
        const data = await response.json()
        const currentPrice = data[crypto.coinId.toLowerCase()]?.brl || 0

        // Calcula o novo lucro/prejuízo
        const currentValue = crypto.amount * currentPrice
        const profit = currentValue - crypto.investedValue

        // Atualiza a criptomoeda
        await prisma.crypto.update({
          where: { id: crypto.id },
          data: {
            currentPrice,
            profit
          }
        })
      } catch (error) {
        console.error(`Error updating ${crypto.name}:`, error)
      }
    }

    // Atualiza os totais do portfolio
    const updatedCryptos = await prisma.crypto.findMany()
    const totalValue = updatedCryptos.reduce((sum, crypto) => 
      sum + (crypto.amount * crypto.currentPrice), 0
    )
    const totalProfit = updatedCryptos.reduce((sum, crypto) => 
      sum + crypto.profit, 0
    )

    // Busca todos os portfolios e atualiza cada um
    const portfolios = await prisma.portfolio.findMany({
      include: { cryptos: true }
    })

    for (const portfolio of portfolios) {
      const portfolioCryptos = portfolio.cryptos
      const portfolioTotalValue = portfolioCryptos.reduce(
        (sum, crypto) => sum + (crypto.amount * crypto.currentPrice), 
        0
      )
      const portfolioTotalProfit = portfolioCryptos.reduce(
        (sum, crypto) => sum + crypto.profit,
        0
      )

      await prisma.portfolio.update({
        where: { id: portfolio.id },
        data: {
          totalValue: portfolioTotalValue,
          totalProfit: portfolioTotalProfit
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating prices:', error)
    return NextResponse.json({ error: 'Failed to update prices' }, { status: 500 })
  }
} 