import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cryptos = await prisma.crypto.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(cryptos)
  } catch (error) {
    console.error('Error fetching crypto stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch crypto stats' },
      { status: 500 }
    )
  }
}