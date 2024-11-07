import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next"

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { coinId, symbol, name, amount, investedValue, portfolioId } = body;

    console.log('Creating crypto with data:', {
      coinId,
      symbol,
      name,
      amount,
      investedValue,
      portfolioId
    });

    // Buscar preço atual da criptomoeda
    const priceResponse = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_7d_change=true&include_market_cap=true&include_24hr_vol=true`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Crypto Portfolio Tracker'
        },
        next: { revalidate: 30 }
      }
    );

    if (!priceResponse.ok) {
      throw new Error(`Failed to fetch price data: ${priceResponse.status}`);
    }

    const priceData = await priceResponse.json();
    
    if (!priceData[coinId]) {
      throw new Error('Cryptocurrency not found');
    }

    const currentPrice = priceData[coinId].usd;
    const profit = (currentPrice * Number(amount)) - Number(investedValue);

    // Criar a criptomoeda no banco de dados
    const crypto = await prisma.crypto.create({
      data: {
        coinId,
        name,
        symbol,
        currentPrice,
        image: `https://assets.coingecko.com/coins/images/1/small/bitcoin.png`, // Você pode ajustar isso
        priceChangePercentage24h: priceData[coinId].usd_24h_change || 0,
        priceChangePercentage7d: priceData[coinId].usd_7d_change || 0,
        marketCap: priceData[coinId].usd_market_cap || 0,
        totalVolume: priceData[coinId].usd_24h_vol || 0,
        amount: Number(amount),
        investedValue: Number(investedValue),
        profit,
        portfolioId
      }
    });

    // Atualizar o valor total e lucro do portfólio
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: { cryptos: true }
    });

    if (portfolio) {
      const totalValue = portfolio.cryptos.reduce(
        (acc, crypto) => acc + (crypto.currentPrice * crypto.amount),
        0
      );
      const totalProfit = portfolio.cryptos.reduce(
        (acc, crypto) => acc + crypto.profit,
        0
      );

      await prisma.portfolio.update({
        where: { id: portfolioId },
        data: {
          totalValue,
          totalProfit
        }
      });
    }

    return NextResponse.json({ success: true, data: crypto });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: 'Failed to add crypto' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession()
  
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const portfolios = await prisma.portfolio.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      cryptos: true
    }
  })

  return new Response(JSON.stringify(portfolios))
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Crypto ID is required' },
      { status: 400 }
    );
  }

  try {
    await prisma.crypto.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting crypto:', error);
    return NextResponse.json(
      { error: 'Failed to delete crypto' },
      { status: 500 }
    );
  }
}