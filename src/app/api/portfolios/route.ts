import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const portfolios = await prisma.portfolio.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        cryptos: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            subscriptionStatus: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const enrichedPortfolios = portfolios.map((portfolio) => {
      const totalInvested = portfolio.cryptos.reduce((acc, crypto) => {
        return acc + crypto.investedValue
      }, 0)

      const totalValue = portfolio.cryptos.reduce((acc, crypto) => {
        const currentValue = crypto.currentPrice * crypto.amount
        return acc + currentValue
      }, 0)

      const totalProfit = totalValue - totalInvested

      return {
        ...portfolio,
        totalInvested: Number(totalInvested.toFixed(2)),
        totalValue: Number(totalValue.toFixed(2)),
        totalProfit: Number(totalProfit.toFixed(2))
      }
    })

    return NextResponse.json(enrichedPortfolios)
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 