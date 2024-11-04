const COINGECKO_API = 'https://api.coingecko.com/api/v3'

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  image: string
}

export interface PriceHistoryPoint {
  timestamp: number
  price: number
}

export async function getTopCryptos(currency: string = 'brl', limit: number = 50) {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`,
      { next: { revalidate: 60 } } // Cache for 1 minute
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto data')
    }
    
    const data: CryptoPrice[] = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching crypto data:', error)
    throw error
  }
}

export async function getCryptoHistory(coinId: string, days: string | number, currency: string = 'brl'): Promise<PriceHistoryPoint[]> {
  try {
    const daysParam = days === 'max' ? 'max' : Number(days)
    const interval = daysParam === 'max' || Number(days) > 90 ? 'daily' : 'hourly'

    const response = await fetch(
      `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${daysParam}&interval=${interval}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    )

    if (!response.ok) {
      throw new Error('Failed to fetch crypto history')
    }

    const data = await response.json()
    return data.prices.map(([timestamp, price]: [number, number]) => ({
      timestamp,
      price
    }))
  } catch (error) {
    console.error('Error fetching crypto history:', error)
    throw error
  }
} 