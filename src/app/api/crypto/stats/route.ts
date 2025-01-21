import { NextResponse } from 'next/server'
import { getTopCryptos } from '@/lib/coingecko'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cryptos = await getTopCryptos('usd', 100)
    
    const formattedCryptos = cryptos.map(crypto => ({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      currentPrice: crypto.current_price,
      image: crypto.image,
      priceChangePercentage24h: crypto.price_change_percentage_24h,
      priceChangePercentage7d: crypto.price_change_percentage_7d,
      marketCap: crypto.market_cap,
      totalVolume: crypto.total_volume
    }))

    return NextResponse.json(formattedCryptos)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency stats' },
      { status: 500 }
    )
  }
}