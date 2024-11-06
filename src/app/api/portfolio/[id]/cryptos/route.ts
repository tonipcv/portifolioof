import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const portfolioId = context.params.id;

    const cryptos = await prisma.crypto.findMany({
      where: {
        portfolioId
      }
    });

    return NextResponse.json({
      success: true,
      data: cryptos
    });
  } catch (error) {
    console.error('Error fetching cryptos:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch cryptocurrencies',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 