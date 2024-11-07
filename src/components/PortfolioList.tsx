'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DeletePortfolioButton } from './DeletePortfolioButton'
import { RefreshCw } from 'lucide-react'

interface Portfolio {
  id: string
  name: string
  description: string | null
  totalValue: number
  totalProfit: number
  cryptos: any[]
}

export function PortfolioList() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  async function loadPortfolios() {
    try {
      setIsRefreshing(true)
      const response = await fetch('/api/portfolio', {
        cache: 'no-store'
      })
      if (!response.ok) {
        throw new Error('Failed to fetch portfolios')
      }
      const data = await response.json()
      setPortfolios(data)
    } catch (error) {
      console.error('Error loading portfolios:', error)
    } finally {
      setIsRefreshing(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPortfolios()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400">Carregando portfolios...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={loadPortfolios}
          disabled={isRefreshing}
          className="text-gray-400 hover:text-blue-400 p-2 rounded-full hover:bg-[#222222] transition-colors disabled:opacity-50"
          title="Atualizar portfolios"
        >
          <RefreshCw 
            size={20} 
            className={`${isRefreshing ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      {portfolios.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-400">Nenhum portfolio encontrado.</p>
          <p className="text-gray-500 text-sm mt-2">
            Crie seu primeiro portfolio usando o botão acima.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className="bg-[#161616] p-6 rounded-lg border border-[#222222] hover:border-[#333333] transition-colors cursor-pointer relative"
              onClick={() => router.push(`/portfolios/${portfolio.id}`)}
            >
              <DeletePortfolioButton 
                portfolioId={portfolio.id} 
                onDelete={loadPortfolios}
              />
              <h2 className="text-xl font-semibold mb-2">{portfolio.name}</h2>
              {portfolio.description && (
                <p className="text-gray-400 text-sm mb-4">{portfolio.description}</p>
              )}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Valor Total:</span>
                  <span className="text-white">
                    ${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Lucro/Prejuízo:</span>
                  <span className={portfolio.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
                    ${portfolio.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Ativos:</span>
                  <span className="text-white">{portfolio.cryptos.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 