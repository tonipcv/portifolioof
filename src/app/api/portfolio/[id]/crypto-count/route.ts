import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const count = await prisma.crypto.count({
      where: {
        portfolioId: params.id
      }
    })

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: params.id },
      include: { user: true }
    })

    return NextResponse.json({ 
      count,
      subscriptionStatus: portfolio?.user?.subscriptionStatus
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 