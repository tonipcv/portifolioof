const BINANCE_API = 'https://api.binance.com/api/v3'

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  image: string
}

const cryptoNames: Record<string, string> = {
  'BTC': 'Bitcoin',
  'ETH': 'Ethereum',
  'BNB': 'Binance Coin',
  'XRP': 'Ripple',
  'ADA': 'Cardano',
  'DOGE': 'Dogecoin',
  'SOL': 'Solana',
  'DOT': 'Polkadot',
  'MATIC': 'Polygon',
  'AVAX': 'Avalanche',
}

const cryptoIds: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'BNB': 'binancecoin',
  'XRP': 'ripple',
  'ADA': 'cardano',
  'DOGE': 'dogecoin',
  'SOL': 'solana',
  'DOT': 'polkadot',
  'MATIC': 'matic-network',
  'AVAX': 'avalanche-2',
}

export async function getTopCryptos(currency: string = 'brl') {
  try {
    const symbols = Object.keys(cryptoNames).map(symbol => `${symbol}${currency.toUpperCase()}`)
    const [pricesResponse, changesResponse] = await Promise.all([
      fetch(`${BINANCE_API}/ticker/price?symbols=${JSON.stringify(symbols)}`),
      fetch(`${BINANCE_API}/ticker/24hr?symbols=${JSON.stringify(symbols)}`)
    ])

    if (!pricesResponse.ok || !changesResponse.ok) {
      throw new Error('Failed to fetch crypto data')
    }

    const prices = await pricesResponse.json()
    const changes = await changesResponse.json()

    const cryptos: CryptoPrice[] = prices.map((price: any) => {
      const symbol = price.symbol.replace(currency.toUpperCase(), '')
      const change = changes.find((c: any) => c.symbol === price.symbol)
      
      return {
        id: cryptoIds[symbol],
        symbol: symbol.toLowerCase(),
        name: cryptoNames[symbol],
        current_price: parseFloat(price.price),
        price_change_percentage_24h: parseFloat(change?.priceChangePercent || '0'),
        image: `https://cryptologos.cc/logos/${cryptoIds[symbol]}-${symbol.toLowerCase()}-logo.png`
      }
    })

    return cryptos
  } catch (error) {
    console.error('Error fetching crypto data:', error)
    throw error
  }
}

export interface PriceHistoryPoint {
  timestamp: number
  price: number
}

export async function getCryptoHistory(symbol: string, interval: string, limit: number = 500, currency: string = 'brl'): Promise<PriceHistoryPoint[]> {
  try {
    const response = await fetch(
      `${BINANCE_API}/klines?symbol=${symbol}${currency.toUpperCase()}&interval=${interval}&limit=${limit}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch crypto history')
    }

    const data = await response.json()
    return data.map(([timestamp, open]: [number, string]) => ({
      timestamp,
      price: parseFloat(open)
    }))
  } catch (error) {
    console.error('Error fetching crypto history:', error)
    throw error
  }
}

function getKlineInterval(period: string): string {
  switch (period) {
    case '1d':
      return '1h'  // 1 hour intervals for 1 day
    case '1w':
      return '4h'  // 4 hour intervals for 1 week
    case '1m':
      return '1d'  // 1 day intervals for 1 month
    case '1y':
      return '1w'  // 1 week intervals for 1 year
    case 'all':
      return '1M'  // 1 month intervals for all time
    default:
      return '4h'
  }
}

export async function getCryptoHistoryForPeriod(symbol: string, period: string, currency: string = 'brl'): Promise<PriceHistoryPoint[]> {
  const interval = getKlineInterval(period)
  let limit = 500

  switch (period) {
    case '1d':
      limit = 24  // 24 hours
      break
    case '1w':
      limit = 42  // 7 days * 6 (4-hour intervals)
      break
    case '1m':
      limit = 30  // 30 days
      break
    case '1y':
      limit = 52  // 52 weeks
      break
    case 'all':
      limit = 60  // 5 years of monthly data
      break
  }

  return getCryptoHistory(symbol, interval, limit, currency)
} 