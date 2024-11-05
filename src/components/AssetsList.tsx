/* eslint-disable */

'use client'

import { useEffect, useState } from 'react'
import { Crypto } from '@prisma/client'

interface AssetsListProps {
  portfolioId?: string
}

export default function AssetsList({ portfolioId }: AssetsListProps) {
  const [assets, setAssets] = useState<Crypto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAssets = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/crypto/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setAssets(data)
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error loading assets:', error.message)
        setError(`Falha ao carregar ativos: ${error.message}`)
      } else {
        console.error('Error loading assets:', error)
        setError('Falha ao carregar ativos')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAssets()

    const intervalId = setInterval(async () => {
      try {
        const response = await fetch('/api/crypto/update-prices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(10000)
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        loadAssets()
      } catch (error) {
        console.error('Error updating prices:', error)
      }
    }, 60000)

    return () => clearInterval(intervalId)
  }, [portfolioId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={loadAssets}
          className="mt-2 px-4 py-2 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Nenhum ativo encontrado</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Preço</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">24h %</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">7d %</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Market Cap</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Volume (24h)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={asset.image || '/placeholder-coin.png'}
                      alt={asset.name}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-200">{asset.name}</div>
                      <div className="text-sm text-gray-400">{asset.symbol.toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  ${asset.currentPrice?.toLocaleString() ?? 'N/A'}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  (asset.priceChangePercentage24h ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {asset.priceChangePercentage24h?.toFixed(2) ?? 'N/A'}%
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  (asset.priceChangePercentage7d ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {asset.priceChangePercentage7d?.toFixed(2) ?? 'N/A'}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  ${asset.marketCap?.toLocaleString() ?? 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  ${asset.totalVolume?.toLocaleString() ?? 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 