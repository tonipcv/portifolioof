const COINGECKO_API = 'https://api.coingecko.com/api/v3'

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  price_change_percentage_7d: number
  market_cap: number
  total_volume: number
  image: string
}

export interface PriceHistoryPoint {
  timestamp: number
  price: number
}

export async function getTopCryptos(currency: string = 'usd', limit: number = 50) {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h,7d&include_24hr_vol=true`,
      { 
        next: { revalidate: 30 },
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Crypto Portfolio Tracker'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto data')
    }
    
    const data = await response.json()
    
    const formattedData: CryptoPrice[] = data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h || 0,
      price_change_percentage_7d: coin.price_change_percentage_7d || 0,
      market_cap: coin.market_cap || 0,
      total_volume: coin.total_volume || 0,
      image: coin.image
    }))

    return formattedData
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