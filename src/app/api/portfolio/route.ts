import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Portfolio, Crypto } from '@prisma/client'

interface PortfolioWithCryptos extends Portfolio {
  cryptos: Crypto[]
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log('API - Session:', session?.user?.id)
    
    if (!session?.user?.id) {
      console.log('API - No user ID in session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    console.log('API - Found portfolios:', portfolios.length)

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

    console.log('API - Returning enriched portfolios')
    return NextResponse.json(enrichedPortfolios)
  } catch (error) {
    console.error('API - Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Adicionar método POST para criar portfólios
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        name,
        description: description || null,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Error creating portfolio:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Adicionar método DELETE
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Extrair o ID do portfólio da URL
    const url = new URL(request.url)
    const portfolioId = url.searchParams.get('id')

    if (!portfolioId) {
      return new NextResponse('Portfolio ID is required', { status: 400 })
    }

    // Verificar se o portfólio pertence ao usuário
    const portfolio = await prisma.portfolio.findUnique({
      where: {
        id: portfolioId,
        userId: session.user.id
      }
    })

    if (!portfolio) {
      return new NextResponse('Portfolio not found', { status: 404 })
    }

    // Primeiro deletar todas as criptomoedas associadas
    await prisma.crypto.deleteMany({
      where: {
        portfolioId: portfolioId
      }
    })

    // Depois deletar o portfólio
    await prisma.portfolio.delete({
      where: {
        id: portfolioId
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting portfolio:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}