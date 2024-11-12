import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTopCryptos } from '@/lib/coingecko'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Buscar criptomoedas do portfólio
    const cryptos = await prisma.crypto.findMany({
      where: {
        portfolioId: params.id
      }
    })

    // Buscar preços atualizados
    const currentPrices = await getTopCryptos()

    // Atualizar os preços e calcular lucro/prejuízo
    const updatedCryptos = cryptos.map(crypto => {
      const priceInfo = currentPrices.find(p => p.id === crypto.coinId)
      
      if (priceInfo) {
        const currentValue = priceInfo.current_price * crypto.amount
        const profit = currentValue - crypto.investedValue

        return {
          ...crypto,
          currentPrice: priceInfo.current_price,
          priceChangePercentage24h: priceInfo.price_change_percentage_24h,
          priceChangePercentage7d: priceInfo.price_change_percentage_7d,
          profit: profit
        }
      }
      
      return crypto
    })

    // Atualizar no banco de dados
    await Promise.all(
      updatedCryptos.map(crypto =>
        prisma.crypto.update({
          where: { id: crypto.id },
          data: {
            currentPrice: crypto.currentPrice,
            priceChangePercentage24h: crypto.priceChangePercentage24h,
            priceChangePercentage7d: crypto.priceChangePercentage7d,
            profit: crypto.profit
          }
        })
      )
    )

    return NextResponse.json({
      data: updatedCryptos
    })
  } catch (error) {
    console.error('Error fetching portfolio cryptos:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 