import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    // Busca todas as criptomoedas do portfolio
    const cryptos = await prisma.crypto.findMany()
    
    // Atualiza cada criptomoeda
    for (const crypto of cryptos) {
      try {
        // Busca o preço atual da API
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${crypto.name.toLowerCase()}&vs_currencies=brl`
        )
        const data = await response.json()
        const currentPrice = data[crypto.name.toLowerCase()]?.brl || crypto.currentPrice

        // Calcula o novo lucro/prejuízo
        const currentValue = crypto.amount * currentPrice
        const profit = currentValue - crypto.investedAmount

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
      sum + (crypto.profit || 0), 0
    )

    await prisma.portfolio.update({
      where: { id: 1 },
      data: {
        totalValue,
        totalProfit
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating prices:', error)
    return NextResponse.json({ error: 'Failed to update prices' }, { status: 500 })
  }
} 