const COINGECKO_API = 'https://pro-api.coingecko.com/api/v3'

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  price_change_percentage_7d?: number
  market_cap?: number
  total_volume?: number
}

export interface PriceHistoryPoint {
  timestamp: number
  price: number
}

export async function getTopCryptos(): Promise<CryptoPrice[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=400&page=1&sparkline=false&price_change_percentage=24h,7d`,
      {
        headers: {
          'accept': 'application/json',
          'x-cg-pro-api-key': 'CG-hpbLQhyhxzcJJyUkjQdBjkPc'
        },
        next: { revalidate: 60 } // Revalidar a cada 1 minuto
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch crypto prices')
    }

    const data = await response.json()
    
    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.image,
      current_price: Number(coin.current_price) || 0,
      price_change_percentage_24h: Number(coin.price_change_percentage_24h) || 0,
      price_change_percentage_7d: Number(coin.price_change_percentage_7d_in_currency) || 0,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume
    }))
  } catch (error) {
    console.error('Error fetching crypto prices:', error)
    throw error
  }
}

export async function getCryptoHistory(coinId: string, days: string | number, currency: string = 'usd'): Promise<PriceHistoryPoint[]> {
  try {
    const daysParam = days === 'max' ? 'max' : Number(days)
    const interval = daysParam === 'max' || Number(days) > 90 ? 'daily' : 'hourly'

    const response = await fetch(
      `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${daysParam}&interval=${interval}`,
      {
        headers: {
          'accept': 'application/json',
          'x-cg-pro-api-key': 'CG-hpbLQhyhxzcJJyUkjQdBjkPc'
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch crypto history')
    }

    const data = await response.json()
    return data.prices.map(([timestamp, price]: [number, number]) => ({
      timestamp,
      price: Number(price) || 0
    }))
  } catch (error) {
    console.error('Error fetching crypto history:', error)
    throw error
  }
} 