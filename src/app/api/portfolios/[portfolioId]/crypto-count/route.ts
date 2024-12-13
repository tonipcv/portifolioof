import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { portfolioId: string } }
) {
  try {
    const count = await prisma.crypto.count({
      where: {
        portfolioId: params.portfolioId
      }
    })

    return NextResponse.json({ 
      count,
      subscriptionStatus: await prisma.portfolio.findUnique({
        where: { id: params.portfolioId },
        select: { user: { select: { subscriptionStatus: true } } }
      }).then(p => p?.user?.subscriptionStatus)
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 