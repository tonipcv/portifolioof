import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTopCryptos } from '@/lib/coingecko'

export async function GET() {
  try {
    const cryptos = await prisma.crypto.findMany()
    const prices = await getTopCryptos()

    // Atualizar preços e calcular lucro/prejuízo
    const updates = cryptos.map(async (crypto) => {
      const priceInfo = prices.find(p => p.id === crypto.coinId)
      
      if (priceInfo) {
        const currentValue = priceInfo.current_price * crypto.amount
        const profit = currentValue - crypto.investedValue

        return prisma.crypto.update({
          where: { id: crypto.id },
          data: {
            currentPrice: priceInfo.current_price,
            priceChangePercentage24h: priceInfo.price_change_percentage_24h,
            priceChangePercentage7d: priceInfo.price_change_percentage_7d,
            profit: profit
          }
        })
      }
      return null
    })

    await Promise.all(updates.filter(Boolean))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating crypto prices:', error)
    return NextResponse.json(
      { error: 'Failed to update prices' },
      { status: 500 }
    )
  }
} 