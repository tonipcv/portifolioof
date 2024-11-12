/* eslint-disable */

'use client'

import { useEffect, useState } from 'react'
import { Crypto } from '@prisma/client'
import AddCryptoModal from './AddCryptoModal'
import Image from 'next/image'
import CryptoDetailsModal from './CryptoDetailsModal'

interface AssetsListProps {
  portfolioId?: string
}

const formatUSD = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export default function AssetsList({ portfolioId }: AssetsListProps) {
  const [assets, setAssets] = useState<Crypto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const loadAssets = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const endpoint = portfolioId 
        ? `/api/portfolio/${portfolioId}/cryptos`
        : '/api/crypto/stats'

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(30000)
      })

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`)
      }
      
      const data = await response.json()
      setAssets(data.data || data)
    } catch (error) {
      console.error('Error loading assets:', error)
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        setError('Tempo limite excedido. Por favor, tente novamente.')
      } else if (error instanceof Error) {
        setError(`Falha ao carregar ativos: ${error.message}`)
      } else {
        setError('Erro inesperado ao carregar ativos')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (cryptoId: string) => {
    try {
      const response = await fetch(`/api/crypto/${cryptoId}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(15000)
      })

      if (!response.ok) {
        throw new Error('Falha ao deletar criptomoeda')
      }

      await loadAssets()
    } catch (error) {
      console.error('Error deleting crypto:', error)
      if (error instanceof DOMException && error.name === 'AbortError') {
        setError('Tempo limite excedido ao tentar remover. Por favor, tente novamente.')
      } else {
        setError('Falha ao deletar criptomoeda')
      }
    }
  }

  useEffect(() => {
    loadAssets()

    const intervalId = setInterval(loadAssets, 120000)
    return () => clearInterval(intervalId)
  }, [portfolioId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
        <p className="text-red-400">{error}</p>
        <button 
          onClick={loadAssets}
          className="mt-2 px-4 py-2 text-sm bg-red-900/30 text-red-400 rounded-md hover:bg-red-900/50 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {portfolioId && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition-colors"
          >
            Adicionar Criptomoeda
          </button>
        </div>
      )}

      <div className="bg-[#161616] rounded-lg shadow-lg border border-[#222222]">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-[#222222]">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Preço</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">24h %</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">7d %</th>
                {portfolioId && (
                  <>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Quantidade</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Investido</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Lucro/Prejuízo</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Ações</th>
                  </>
                )}
                {!portfolioId && (
                  <>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Market Cap</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Volume (24h)</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {assets.map((asset) => (
                <tr 
                  key={asset.id} 
                  className="hover:bg-[#222222] transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedCrypto(asset)
                    setIsDetailsModalOpen(true)
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full mr-3 flex items-center justify-center bg-gray-700">
                        <span className="text-xs text-gray-300">
                          {asset.symbol.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-200">{asset.name}</div>
                        <div className="text-sm text-gray-500">{asset.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatUSD(asset.currentPrice)}
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
                  {portfolioId && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {asset.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatUSD(asset.investedValue)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        asset.profit >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {formatUSD(asset.profit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Remover
                        </button>
                      </td>
                    </>
                  )}
                  {!portfolioId && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        ${asset.marketCap?.toLocaleString() ?? 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        ${asset.totalVolume?.toLocaleString() ?? 'N/A'}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {portfolioId && (
        <>
          <AddCryptoModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            portfolioId={portfolioId}
            onSuccess={loadAssets}
          />
          <CryptoDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            crypto={selectedCrypto}
          />
        </>
      )}
    </div>
  )
} 