import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Portfolio, Crypto } from '@prisma/client'

interface PortfolioWithCryptos extends Portfolio {
  cryptos: Crypto[]
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const portfolios = await prisma.portfolio.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        cryptos: true
      }
    }) as PortfolioWithCryptos[]

    // Calcular os valores totais para cada portfólio
    const enrichedPortfolios = portfolios.map((portfolio: PortfolioWithCryptos) => {
      const totalInvested = portfolio.cryptos.reduce((acc: number, crypto: Crypto) => {
        return acc + crypto.investedValue
      }, 0)

      const totalValue = portfolio.cryptos.reduce((acc: number, crypto: Crypto) => {
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
    console.error('Error fetching portfolios:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// Adicionar método POST para criar portfólios
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userId = session.user.id
    if (!userId) {
      return new NextResponse('User ID not found', { status: 400 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return new NextResponse('Nome é obrigatório', { status: 400 })
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
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal Server Error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500 }
    )
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