'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DeletePortfolioButton } from './DeletePortfolioButton'
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'

interface Portfolio {
  id: string
  name: string
  description: string | null
  totalValue: number
  totalProfit: number
  totalInvested: number
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
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
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

  useEffect(() => {
    const intervalId = setInterval(loadPortfolios, 120000)
    return () => clearInterval(intervalId)
  }, [])

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-400">Carregando portfolios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={loadPortfolios}
          disabled={isRefreshing}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-transparent border-2 border-white/20 px-2.5 py-1.5 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50"
          title="Atualizar portfolios"
        >
          <RefreshCw 
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          {isRefreshing ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {portfolios.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-700 p-12">
          <div className="text-center">
            <h2 className="text-sm font-semibold text-gray-200">Nenhum portfolio</h2>
            <p className="mt-1 text-sm text-gray-400">Comece criando seu primeiro portfolio.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className="group relative flex flex-col overflow-hidden rounded-lg bg-[#161616] shadow transition-all hover:shadow-lg hover:ring-1 hover:ring-blue-500"
              onClick={() => router.push(`/portfolios/${portfolio.id}`)}
            >
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-200 group-hover:text-blue-400">
                    {portfolio.name}
                  </h2>
                  <DeletePortfolioButton 
                    portfolioId={portfolio.id} 
                    onDelete={loadPortfolios}
                  />
                </div>
                
                {portfolio.description && (
                  <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                    {portfolio.description}
                  </p>
                )}

                <div className="mt-4 border-t border-gray-800 pt-4">
                  <dl className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-400">Valor Investido:</dt>
                      <dd className="text-sm font-medium text-gray-200">
                        ${portfolio.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-400">Valor Total:</dt>
                      <dd className="text-sm font-medium text-gray-200">
                        ${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-400">Preço Médio:</dt>
                      <dd className="text-sm font-medium text-gray-200">
                        ${(portfolio.totalValue / portfolio.cryptos.reduce((sum, crypto) => sum + crypto.amount, 0) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </dd>
                    </div>
                    <div className="flex justify-between border-t border-gray-800 pt-3">
                      <dt className="text-sm text-gray-400">Lucro/Prejuízo:</dt>
                      <dd className="flex items-center text-sm font-medium">
                        {portfolio.totalProfit >= 0 ? (
                          <TrendingUp className="mr-1 h-4 w-4 text-green-400" />
                        ) : (
                          <TrendingDown className="mr-1 h-4 w-4 text-red-400" />
                        )}
                        <span className={portfolio.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
                          ${Math.abs(portfolio.totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </dd>
                    </div>
                    <div className="flex justify-between border-t border-gray-800 pt-3">
                      <dt className="text-sm text-gray-400">Ativos:</dt>
                      <dd className="text-sm font-medium text-gray-200">
                        {portfolio.cryptos.length}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 