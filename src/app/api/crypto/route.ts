import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { coinId, symbol, name, amount, investedValue, portfolioId } = body;

    if (!coinId || !symbol || !name || !amount || !investedValue || !portfolioId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId }
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    console.log('Creating crypto with data:', {
      coinId,
      symbol,
      name,
      amount,
      investedValue,
      portfolioId
    });

    const crypto = await prisma.crypto.create({
      data: {
        coinId,
        symbol,
        name,
        amount: parseFloat(amount.toString()),
        investedValue: Math.round(parseFloat(investedValue.toString()) * 100), // Store in cents
        portfolioId,
      },
    });

    return NextResponse.json(crypto);
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: 'Failed to add crypto' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const portfolioId = searchParams.get('portfolioId');

  if (!portfolioId) {
    return NextResponse.json(
      { error: 'Portfolio ID is required' },
      { status: 400 }
    );
  }

  try {
    const cryptos = await prisma.crypto.findMany({
      where: {
        portfolioId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(cryptos);
  } catch (error) {
    console.error('Error fetching cryptos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cryptos' },
      { status: 500 }
    );
  }
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