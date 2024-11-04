'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ScaleIcon } from '@heroicons/react/24/outline'

interface Stats {
  totalValue: number
  totalProfit: number
  totalCryptos: number
}

export function CryptoStats() {
  const [stats, setStats] = useState<Stats>({
    totalValue: 0,
    totalProfit: 0,
    totalCryptos: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchStats() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/crypto/stats')
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Erro ao carregar estatísticas')
        }
        
        const data = await response.json()
        
        if (isMounted) {
          setStats(data)
          setError(null)
        }
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchStats()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/50 animate-pulse">
            <div className="h-16"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
        {error}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/50">
        <div className="flex items-center space-x-3">
          <ArrowTrendingUpIcon className="h-8 w-8 text-indigo-500" />
          <div>
            <p className="text-gray-400 text-sm font-light">Total Investido</p>
            <p className="text-2xl font-light">
              R$ {stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/50">
        <div className="flex items-center space-x-3">
          <ScaleIcon className="h-8 w-8 text-indigo-500" />
          <div>
            <p className="text-gray-400 text-sm font-light">Total de Cryptos</p>
            <p className="text-2xl font-light">{stats.totalCryptos}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/50">
        <div className="flex items-center space-x-3">
          <ArrowTrendingDownIcon className="h-8 w-8 text-indigo-500" />
          <div>
            <p className="text-gray-400 text-sm font-light">Lucro/Prejuízo</p>
            <p className={`text-2xl font-light ${stats.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              R$ {stats.totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 