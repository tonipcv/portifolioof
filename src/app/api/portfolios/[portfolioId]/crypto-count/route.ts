import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { portfolioId: string } }
) {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: {
        id: params.portfolioId
      },
      include: {
        user: {
          select: {
            subscriptionStatus: true
          }
        },
        cryptos: true
      }
    })

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      count: portfolio.cryptos.length,
      subscriptionStatus: portfolio.user.subscriptionStatus
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 