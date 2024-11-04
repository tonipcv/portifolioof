'use client'

import { useEffect, useState } from 'react'
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { CryptoPrice, getTopCryptos } from '@/lib/coingecko'

interface Asset {
  id: string
  coinId: string
  name: string
  symbol: string
  amount: number
  investedValue: number
  currentValue: number
  change24h: number
  image: string
}

const formatBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

interface AssetsListProps {
  portfolioId: string
  onUpdate?: () => void
}

export default function AssetsList({ portfolioId, onUpdate }: AssetsListProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAssets = async () => {
    try {
      const [cryptosResponse, prices] = await Promise.all([
        fetch(`/api/crypto?portfolioId=${portfolioId}`),
        getTopCryptos()
      ])

      if (!cryptosResponse.ok) throw new Error('Failed to fetch cryptos')
      
      const cryptos = await cryptosResponse.json()

      const portfolioAssets = cryptos.map((crypto: any) => {
        const priceData = prices.find(p => p.id === crypto.coinId)
        if (!priceData) return null

        return {
          id: crypto.id,
          coinId: crypto.coinId,
          name: crypto.name,
          symbol: crypto.symbol,
          amount: crypto.amount,
          investedValue: crypto.investedValue / 100, // Convert from cents
          currentValue: priceData.current_price * crypto.amount,
          change24h: priceData.price_change_percentage_24h,
          image: priceData.image
        }
      }).filter((asset): asset is Asset => asset !== null)

      setAssets(portfolioAssets)
      setError(null)
    } catch (error) {
      console.error('Error loading assets:', error)
      setError('Falha ao carregar ativos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAssets()
  }, [portfolioId])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/crypto?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete crypto')

      await loadAssets()
      onUpdate?.()
    } catch (error) {
      console.error('Error deleting crypto:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <ChartBarIcon className="h-8 w-8 text-gray-400 animate-pulse" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-400">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CurrencyDollarIcon className="h-6 w-6 text-blue-500" />
        <h3 className="text-lg font-medium text-white">Seus Ativos</h3>
      </div>
      <div className="grid gap-4">
        {assets.map((asset) => (
          <div 
            key={asset.id}
            className="bg-gray-800 p-4 rounded-lg flex justify-between items-center hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-700 rounded-lg">
                <img 
                  src={asset.image} 
                  alt={asset.name} 
                  className="h-6 w-6"
                />
              </div>
              <div>
                <h4 className="text-white font-medium">{asset.name}</h4>
                <p className="text-gray-400">
                  {asset.symbol.toUpperCase()} • {asset.amount} unidades
                </p>
                <p className="text-sm text-gray-500">
                  Investido: {formatBRL(asset.investedValue)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-white font-medium">{formatBRL(asset.currentValue)}</p>
                <div className="flex items-center gap-1 justify-end">
                  {asset.change24h >= 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-400" />
                  )}
                  <p className={`${
                    asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {asset.change24h > 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(asset.id)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
        {assets.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Nenhum ativo adicionado ainda
          </div>
        )}
      </div>
    </div>
  )
} 