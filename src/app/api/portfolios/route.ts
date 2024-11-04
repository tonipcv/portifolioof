import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

    const portfolio = await prisma.portfolio.create({
      data: {
        name,
        description,
      },
    })

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Error creating portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    const portfolios = await prisma.portfolio.findMany({
      include: {
        cryptos: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(portfolios)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 