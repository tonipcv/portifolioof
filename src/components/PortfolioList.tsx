'use client'

import { useState, useEffect } from 'react'
import { FolderIcon, PlusIcon } from '@heroicons/react/24/outline'
import CreatePortfolioModal from './CreatePortfolioModal'
import Portfolio from './Portfolio'

interface Portfolio {
  id: string
  name: string
  description: string | null
  cryptos: Array<{
    id: string
    name: string
    amount: number
  }>
}

export default function PortfolioList() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(null)

  const fetchPortfolios = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('Fetching portfolios...')
      const response = await fetch('/api/portfolios')
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Response error:', errorData)
        throw new Error(`HTTP error! status: ${response.status}. Message: ${errorData.error}`)
      }
      
      const data = await response.json()
      console.log('Portfolios fetched:', data)
      setPortfolios(data)
    } catch (error) {
      console.error('Error details:', error)
      setError('Falha ao carregar portfólios. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPortfolios()
  }, [])

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-700 rounded w-1/4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (selectedPortfolio) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedPortfolio(null)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Voltar aos portfólios
          </button>
        </div>
        <Portfolio portfolioId={selectedPortfolio} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Seus Portfólios</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Novo Portfólio
        </button>
      </div>

      {error ? (
        <div className="text-center py-8 bg-gray-800 rounded-lg">
          <div className="text-red-400 mb-4">{error}</div>
          <button
            onClick={fetchPortfolios}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      ) : portfolios.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-white">Nenhum portfólio</h3>
          <p className="mt-1 text-sm text-gray-400">Comece criando um novo portfólio</p>
          <div className="mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              <PlusIcon className="h-5 w-5" />
              Novo Portfólio
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              onClick={() => setSelectedPortfolio(portfolio.id)}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FolderIcon className="h-6 w-6 text-blue-400" />
                <h3 className="text-lg font-medium text-white">{portfolio.name}</h3>
              </div>
              {portfolio.description && (
                <p className="mt-1 text-sm text-gray-400">{portfolio.description}</p>
              )}
              <div className="mt-4 text-sm text-gray-400">
                {portfolio.cryptos.length} criptomoedas
              </div>
            </div>
          ))}
        </div>
      )}

      <CreatePortfolioModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          fetchPortfolios() // Refresh the list after creating
        }}
      />
    </div>
  )
} 