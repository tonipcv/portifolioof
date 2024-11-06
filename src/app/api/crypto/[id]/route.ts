/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Context = {
  params: {
    id: string;
  };
};

export async function GET(
  request: Request,
  { params }: Context
) {
  try {
    const coinResponse = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${params.id}&vs_currencies=usd&include_24hr_change=true&include_7d_change=true&include_market_cap=true&include_24hr_vol=true`,
      { 
        next: { revalidate: 30 },
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Crypto Portfolio Tracker'
        }
      }
    );

    if (!coinResponse.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch price data',
        details: `Status: ${coinResponse.status}`
      }, { status: 500 });
    }

    const priceData = await coinResponse.json();
    
    if (!priceData[params.id]) {
      return NextResponse.json({ 
        error: 'Cryptocurrency not found',
        details: 'Invalid coin ID'
      }, { status: 404 });
    }

    const infoResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/${params.id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`,
      { 
        next: { revalidate: 3600 },
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Crypto Portfolio Tracker'
        }
      }
    );

    if (!infoResponse.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch coin info',
        details: `Status: ${infoResponse.status}`
      }, { status: 500 });
    }

    const infoData = await infoResponse.json();

    return NextResponse.json({
      success: true,
      data: {
        id: params.id,
        name: infoData.name,
        symbol: infoData.symbol,
        image: infoData.image?.small || null,
        currentPrice: priceData[params.id].usd || 0,
        priceChangePercentage24h: priceData[params.id].usd_24h_change || 0,
        priceChangePercentage7d: priceData[params.id].usd_7d_change || 0,
        marketCap: priceData[params.id].usd_market_cap || 0,
        totalVolume: priceData[params.id].usd_24h_vol || 0,
      }
    });
  } catch (error) {
    console.error('Error fetching crypto:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch cryptocurrency data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: Context
) {
  try {
    const crypto = await prisma.crypto.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true, data: crypto });
  } catch (error) {
    console.error('Error deleting crypto:', error);
    return NextResponse.json({ 
      error: 'Failed to delete cryptocurrency',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
