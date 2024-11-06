import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!request.body) {
      return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
    }

    const body = await request.json();
    const { coinId, amount, investedValue } = body;

    if (!coinId || !amount || !investedValue) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        details: 'coinId, amount, and investedValue are required' 
      }, { status: 400 });
    }

    // Buscar preço atual e dados de mercado
    const priceResponse = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_7d_change=true&include_market_cap=true&include_24hr_vol=true`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Crypto Portfolio Tracker',
        },
        next: { revalidate: 30 }
      }
    );

    if (!priceResponse.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch price data',
        details: `API returned status ${priceResponse.status}`
      }, { status: 502 });
    }

    const priceData = await priceResponse.json();
    
    if (!priceData[coinId]) {
      return NextResponse.json({ 
        error: 'Invalid crypto data',
        details: 'Cryptocurrency not found'
      }, { status: 404 });
    }

    // Buscar informações básicas da moeda
    const infoResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Crypto Portfolio Tracker',
        },
        next: { revalidate: 3600 }
      }
    );

    if (!infoResponse.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch coin info',
        details: `API returned status ${infoResponse.status}`
      }, { status: 502 });
    }

    const infoData = await infoResponse.json();
    const currentPrice = priceData[coinId].usd;
    const profit = (currentPrice * Number(amount)) - Number(investedValue);

    try {
      // Adicionar a criptomoeda ao portfólio
      const crypto = await prisma.crypto.create({
        data: {
          coinId,
          name: infoData.name,
          symbol: infoData.symbol,
          currentPrice,
          image: infoData.image?.small || null,
          priceChangePercentage24h: priceData[coinId].usd_24h_change || 0,
          priceChangePercentage7d: priceData[coinId].usd_7d_change || 0,
          marketCap: priceData[coinId].usd_market_cap || 0,
          totalVolume: priceData[coinId].usd_24h_vol || 0,
          amount: Number(amount),
          investedValue: Number(investedValue),
          profit,
          portfolioId: params.id
        }
      });

      // Atualizar o valor total e lucro do portfólio
      const portfolio = await prisma.portfolio.findUnique({
        where: { id: params.id },
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
          where: { id: params.id },
          data: {
            totalValue,
            totalProfit
          }
        });
      }

      return NextResponse.json({ success: true, data: crypto });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ 
        error: 'Database operation failed',
        details: dbError instanceof Error ? dbError.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error adding crypto:', error);
    return NextResponse.json({ 
      error: 'Failed to add cryptocurrency',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 