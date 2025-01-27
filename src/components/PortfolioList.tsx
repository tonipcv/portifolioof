'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { DeletePortfolioButton } from './DeletePortfolioButton'
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CreatePortfolioButton } from './CreatePortfolioButton'

interface Portfolio {
  id: string
  name: string
  description: string | null
  totalValue: number
  totalProfit: number
  totalInvested: number
  cryptos: any[]
}

// Função para buscar cotação do dólar
async function getUSDToBRL() {
  try {
    const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
    const data = await response.json();
    return parseFloat(data.USDBRL.bid);
  } catch (error) {
    console.error('Error fetching USD to BRL rate:', error);
    return 5.00; // Valor fallback caso a API falhe
  }
}

// Função para formatar valores em BRL
const formatBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export function PortfolioList() {
  const { data: session, status } = useSession()
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [usdToBRL, setUsdToBRL] = useState(5.00)
  const router = useRouter()

  const loadPortfolios = useCallback(async () => {
    try {
      setLoading(true)
      const usdRate = await getUSDToBRL()
      setUsdToBRL(usdRate)

      const response = await fetch('/api/portfolio')
      if (!response.ok) throw new Error('Failed to fetch portfolios')
      
      const data = await response.json()
      setPortfolios(data)
    } catch (error) {
      console.error('Error loading portfolios:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      console.log('Session authenticated, loading portfolios')
      loadPortfolios()
    } else {
      setLoading(false) // Definir loading como false se não houver sessão
    }
  }, [status, session, loadPortfolios])

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
      <div className="flex items-center justify-between mb-6 mt-8 md:mt-0">
        <h2 className="text-xl font-semibold">Meus Portfólios</h2>
        <div className="flex items-center gap-1 md:gap-2">
          <CreatePortfolioButton />
          <Button
            onClick={loadPortfolios}
            size="icon"
            variant="ghost"
            className="bg-transparent hover:bg-white/5"
          >
            <RefreshCw className={cn("h-4 w-4 text-white", { "animate-spin": isRefreshing })} />
          </Button>
        </div>
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
              className="group relative flex flex-col overflow-hidden rounded-lg bg-[#161616] shadow transition-all hover:shadow-lg hover:ring-1 hover:ring-green-100"
              onClick={() => router.push(`/portfolios/${portfolio.id}`)}
            >
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-200 group-hover:text-green-100">
                    {portfolio.name}
                  </h2>
                  <DeletePortfolioButton 
                    portfolioId={portfolio.id} 
                    onDelete={loadPortfolios}
                  />
                </div>

                <div className={`mt-4 p-4 rounded-lg ${
                  portfolio.totalProfit >= 0 
                    ? 'bg-green-900/20 border border-green-100/30' 
                    : 'bg-red-900/20 border border-red-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">L/P</span>
                    <div className="flex items-center">
                      {portfolio.totalProfit >= 0 ? (
                        <TrendingUp className="mr-2 h-5 w-5 text-green-100" />
                      ) : (
                        <TrendingDown className="mr-2 h-5 w-5 text-red-400" />
                      )}
                      <span className={`text-lg font-bold ${
                        portfolio.totalProfit >= 0 ? 'text-green-100' : 'text-red-400'
                      }`}>
                        {formatBRL(Math.abs(portfolio.totalProfit) * usdToBRL)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-400">Retorno</span>
                    <span className={`text-sm font-medium ${
                      portfolio.totalProfit >= 0 ? 'text-green-100' : 'text-red-400'
                    }`}>
                      {((portfolio.totalProfit / portfolio.totalInvested) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-[#1a1a1a] border border-gray-800">
                    <p className="text-sm text-gray-400">Valor Total</p>
                    <p className="text-sm font-medium text-green-100">
                      {formatBRL(portfolio.totalValue * usdToBRL)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1a1a1a] border border-gray-800">
                    <p className="text-sm text-gray-400">Investido</p>
                    <p className="text-sm font-medium text-gray-200">
                      {formatBRL(portfolio.totalInvested * usdToBRL)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-800 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Ativos</span>
                    <span className="text-sm font-medium text-gray-200">
                      {portfolio.cryptos.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 