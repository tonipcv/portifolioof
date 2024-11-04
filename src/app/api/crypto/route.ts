import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fetchCryptoData() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&order=market_cap_desc&per_page=100&page=1&sparkline=false'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const cryptoData = await fetchCryptoData();
    return NextResponse.json(cryptoData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    let portfolio = await prisma.portfolio.findUnique({
      where: { id: 1 }
    })

    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          id: 1,
          name: "Portfolio Padrão",
          description: "Portfolio principal"
        }
      })
    }

    const crypto = await prisma.crypto.create({
      data: {
        name: body.name,
        symbol: body.symbol,
        amount: body.amount,
        buyPrice: body.buyPrice,
        currentPrice: body.currentPrice,
        portfolioId: portfolio.id
      }
    })
    
    return NextResponse.json(crypto)
  } catch (error) {
    console.error('Erro ao criar criptomoeda:', error)
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