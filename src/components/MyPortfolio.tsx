'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'

interface PortfolioCrypto {
  id: number
  name: string
  symbol: string
  amount: number
  buyPrice: number
  currentPrice: number
}

export function MyPortfolio() {
  const [portfolioCryptos, setPortfolioCryptos] = useState<PortfolioCrypto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('/api/portfolio')
        if (!response.ok) throw new Error('Failed to fetch portfolio')
        const data = await response.json()
        setPortfolioCryptos(data)
      } catch (error) {
        console.error('Error fetching portfolio:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortfolio()
  }, [])

  const calculateProfit = (crypto: PortfolioCrypto) => {
    const invested = crypto.amount * crypto.buyPrice
    const current = crypto.amount * crypto.currentPrice
    return current - invested
  }

  if (isLoading) return <div>Carregando...</div>
  if (portfolioCryptos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        Nenhuma criptomoeda adicionada ao portfolio ainda.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {portfolioCryptos.map((crypto) => {
        const profit = calculateProfit(crypto)
        const profitPercentage = (profit / (crypto.amount * crypto.buyPrice)) * 100

        return (
          <div key={crypto.id} className="bg-gray-700/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="font-medium">{crypto.name}</h2>
                <p className="text-sm text-gray-400 uppercase">{crypto.symbol}</p>
              </div>
              <button
                onClick={async () => {
                  try {
                    await fetch(`/api/crypto/${crypto.id}`, { method: 'DELETE' })
                    setPortfolioCryptos(prev => 
                      prev.filter(c => c.id !== crypto.id)
                    )
                  } catch (error) {
                    console.error('Error deleting crypto:', error)
                  }
                }}
                className="text-red-400 hover:text-red-300 p-1 rounded-full"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-1 text-sm">
              <p>Quantidade: {crypto.amount}</p>
              <p>Preço de Compra: R$ {crypto.buyPrice.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</p>
              <p>Preço Atual: R$ {crypto.currentPrice.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</p>
              <p className={profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                Lucro/Prejuízo: R$ {profit.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} ({profitPercentage.toFixed(2)}%)
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
} 