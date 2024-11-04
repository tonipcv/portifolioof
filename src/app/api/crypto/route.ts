import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cryptos = await prisma.crypto.findMany({
      include: {
        portfolio: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(cryptos)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Busca ou cria um portfolio padrão
    let portfolio = await prisma.portfolio.findFirst()
    
    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          name: 'Portfolio Principal',
          totalValue: 0
        }
      })
    }

    const buyPrice = parseFloat(body.price)
    const amount = parseFloat(body.amount)
    
    const crypto = await prisma.crypto.create({
      data: {
        name: body.name,
        symbol: body.symbol || body.name.toUpperCase(),
        amount: amount,
        buyPrice: buyPrice,
        currentPrice: buyPrice,
        portfolioId: portfolio.id,
        profit: 0,
        imageUrl: body.imageUrl || null,
        notes: body.notes || null
      }
    })

    // Atualiza o valor total do portfolio
    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: {
        totalValue: {
          increment: buyPrice * amount
        }
      }
    })
    
    return NextResponse.json(crypto)
  } catch (error) {
    console.error('Failed to create crypto:', error)
    return NextResponse.json(
      { error: 'Failed to create crypto' },
      { status: 500 }
    )
  }
}