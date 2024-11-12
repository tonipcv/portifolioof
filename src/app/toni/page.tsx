'use client'

import { useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface CryptoMarketData {
  current_price: {
    usd: number
  }
  market_cap_rank: number
  price_change_percentage_24h: number
  price_change_percentage_7d: number
}

interface CryptoDetails {
  id: string
  symbol: string
  name: string
  image: string
  market_data: CryptoMarketData
}

interface Crypto {
  id: string
  symbol: string
  name: string
  market_cap_rank: number
  image: string
  current_price: number
  price_change_percentage_24h: number
}

export default function ToniPage() {
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [filteredCryptos, setFilteredCryptos] = useState<Crypto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoDetails | null>(null)

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await fetch(
          'https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false',
          {
            headers: {
              'accept': 'application/json',
              'x-cg-pro-api-key': 'CG-hpbLQhyhxzcJJyUkjQdBjkPc'
            }
          }
        )

        if (!response.ok) {
          throw new Error('Falha ao carregar dados')
        }

        const data = await response.json()
        setCryptos(data)
        setFilteredCryptos(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar criptomoedas')
      } finally {
        setLoading(false)
      }
    }

    fetchCryptos()
  }, [])

  useEffect(() => {
    const filtered = cryptos.filter(crypto =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCryptos(filtered)
  }, [searchTerm, cryptos])

  const fetchCryptoDetails = async (id: string) => {
    try {
      const response = await fetch(
        `https://pro-api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
        {
          headers: {
            'accept': 'application/json',
            'x-cg-pro-api-key': 'CG-hpbLQhyhxzcJJyUkjQdBjkPc'
          }
        }
      )
      if (!response.ok) {
        throw new Error('Falha ao carregar detalhes')
      }
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error)
      return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-500">Erro: {error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Top Criptomoedas</h1>
        
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou símbolo..."
            className="w-full pl-10 pr-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCryptos.map((crypto) => (
          <div
            key={crypto.id}
            className="bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-700 cursor-pointer"
            onClick={async () => {
              const details = await fetchCryptoDetails(crypto.id)
              setSelectedCrypto(details)
            }}
          >
            <div className="flex items-center space-x-3">
              <Image
                src={crypto.image}
                alt={crypto.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-lg text-white">{crypto.name}</h2>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">
                    {crypto.symbol.toUpperCase()}
                  </span>
                  <span className="text-gray-300">
                    ${crypto.current_price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-400">
                Rank #{crypto.market_cap_rank}
              </span>
              <span className={`text-sm ${
                crypto.price_change_percentage_24h > 0 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`}>
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedCrypto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={selectedCrypto.image}
                  alt={selectedCrypto.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedCrypto.name}
                  </h3>
                  <p className="text-gray-400">
                    {selectedCrypto.symbol.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCrypto(null)}
                className="text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            {selectedCrypto.market_data && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Preço Atual (USD)</p>
                    <p className="text-lg font-semibold text-white">
                      ${selectedCrypto.market_data.current_price.usd.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Market Cap Rank</p>
                    <p className="text-lg font-semibold text-white">
                      #{selectedCrypto.market_data.market_cap_rank || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-semibold text-white mb-2">Variação de Preço</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">24h</p>
                      <p className={`font-semibold ${
                        selectedCrypto.market_data.price_change_percentage_24h > 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}>
                        {selectedCrypto.market_data.price_change_percentage_24h?.toFixed(2)}%
                      </p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">7d</p>
                      <p className={`font-semibold ${
                        selectedCrypto.market_data.price_change_percentage_7d > 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}>
                        {selectedCrypto.market_data.price_change_percentage_7d?.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
