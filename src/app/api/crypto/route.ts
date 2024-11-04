import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Iniciando busca de criptomoedas...')
    
    const cryptos = await prisma.crypto.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log('Criptomoedas encontradas:', cryptos.length)
    return NextResponse.json(cryptos)
  } catch (error) {
    console.error('Erro ao buscar criptomoedas:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Primeiro, verifica se existe um portfolio com id 1
    let portfolio = await prisma.portfolio.findUnique({
      where: { id: 1 }
    })

    // Se não existir, cria o portfolio padrão
    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          id: 1,
          name: "Portfolio Padrão",
          description: "Portfolio principal"
        }
      })
    }

    // Agora cria a crypto associada ao portfolio
    const crypto = await prisma.crypto.create({
      data: {
        name: body.name,
        symbol: body.symbol,
        amount: body.amount,
        buyPrice: body.buyPrice,
        currentPrice: body.currentPrice || body.buyPrice, // Usa buyPrice como currentPrice se não fornecido
        portfolioId: portfolio.id
      }
    })
    
    console.log('Crypto criada com sucesso:', crypto)
    return NextResponse.json(crypto)
  } catch (error) {
    console.error('Erro detalhado ao criar criptomoeda:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    return NextResponse.json({ error: 'Erro ao criar criptomoeda' }, { status: 500 })
  }
}

export async function PUT() {
  try {
    const portfolio = await prisma.portfolio.create({
      data: {
        id: 1,
        name: "Portfolio Padrão",
        description: "Portfolio principal"
      }
    })
    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Erro ao criar portfolio:', error)
    return NextResponse.json({ error: 'Erro ao criar portfolio' }, { status: 500 })
  }
}