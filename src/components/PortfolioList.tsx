'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DeletePortfolioButton } from './DeletePortfolioButton'

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
  const router = useRouter()

  async function loadPortfolios() {
    try {
      setLoading(true)
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
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPortfolios()

    const interval = setInterval(loadPortfolios, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400">Carregando portfolios...</p>
      </div>
    )
  }

  if (portfolios.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400">Nenhum portfolio encontrado.</p>
        <p className="text-gray-500 text-sm mt-2">
          Crie seu primeiro portfolio usando o botão acima.
        </p>
      </div>
    )
  }

  return (
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
  )
} 