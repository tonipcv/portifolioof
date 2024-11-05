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
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${params.id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch crypto data');
    }

    const data = await response.json();
    
    const cryptoData = {
      name: data.name,
      symbol: data.symbol,
      currentPrice: data.market_data.current_price.usd,
      image: data.image.small,
      priceChangePercentage24h: data.market_data.price_change_percentage_24h,
      priceChangePercentage7d: data.market_data.price_change_percentage_7d,
      marketCap: data.market_data.market_cap.usd,
      totalVolume: data.market_data.total_volume.usd,
    };

    return NextResponse.json(cryptoData);
  } catch (error) {
    console.error('Error fetching crypto:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency data' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: Context
) {
  try {
    const crypto = await prisma.crypto.delete({
      where: {
        id: params.id,
      },
    });

    if (!crypto) {
      return NextResponse.json(
        { error: 'Cryptocurrency not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting crypto:', error);
    return NextResponse.json(
      { error: 'Failed to delete cryptocurrency' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
