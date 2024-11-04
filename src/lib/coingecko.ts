const COINGECKO_API = 'https://api.coingecko.com/api/v3'

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  image: string
}

export async function getTopCryptos(currency: string = 'brl', limit: number = 50) {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
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