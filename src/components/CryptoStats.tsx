'use client'

import { useEffect, useState } from 'react'

interface PortfolioStats {
  totalInvested: number
  currentValue: number
  totalProfit: number
  profitPercentage: number
}

export function CryptoStats() {
  const [stats, setStats] = useState<PortfolioStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/crypto/stats')
        if (!response.ok) throw new Error('Failed to fetch stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) return <div>Carregando estatísticas...</div>
  if (!stats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gray-700/50 p-4 rounded-lg">
        <h3 className="text-gray-400 text-sm mb-1">Total Investido</h3>
        <p className="text-xl font-medium">
          R$ {stats.totalInvested.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
      </div>

      <div className="bg-gray-700/50 p-4 rounded-lg">
        <h3 className="text-gray-400 text-sm mb-1">Valor Atual</h3>
        <p className="text-xl font-medium">
          R$ {stats.currentValue.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
      </div>

      <div className="bg-gray-700/50 p-4 rounded-lg">
        <h3 className="text-gray-400 text-sm mb-1">Lucro/Prejuízo</h3>
        <p className={`text-xl font-medium ${
          stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          R$ {stats.totalProfit.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
      </div>

      <div className="bg-gray-700/50 p-4 rounded-lg">
        <h3 className="text-gray-400 text-sm mb-1">Retorno</h3>
        <p className={`text-xl font-medium ${
          stats.profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {stats.profitPercentage.toFixed(2)}%
        </p>
      </div>
    </div>
  )
} 