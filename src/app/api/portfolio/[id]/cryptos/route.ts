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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id: portfolioId } = params
    const { cryptoId, amount, investedValue } = await request.json()

    // Verificar se o portfolio pertence ao usuário
    const portfolio = await prisma.portfolio.findUnique({
      where: {
        id: portfolioId,
        userId: session.user.id,
      }
    })

    if (!portfolio) {
      return new NextResponse('Portfolio not found', { status: 404 })
    }

    // Verificar se a cripto já existe no portfolio usando coinId
    const existingCrypto = await prisma.crypto.findFirst({
      where: {
        portfolioId,
        coinId: cryptoId
      }
    })

    if (existingCrypto) {
      // Calcular novo preço médio
      const totalInvestment = existingCrypto.investedValue + investedValue
      const totalAmount = existingCrypto.amount + amount

      // Atualizar a cripto existente com os novos valores
      const updatedCrypto = await prisma.crypto.update({
        where: {
          id: existingCrypto.id
        },
        data: {
          amount: totalAmount,
          investedValue: totalInvestment
        }
      })

      return NextResponse.json(updatedCrypto)
    }

    // Se não existir, criar nova cripto
    const crypto = await prisma.crypto.create({
      data: {
        coinId: cryptoId,
        amount,
        investedValue,
        currentPrice: 0,
        profit: 0,
        name: '',
        symbol: '',
        portfolioId
      }
    })

    return NextResponse.json(crypto)

  } catch (error) {
    console.error('Error adding crypto:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 