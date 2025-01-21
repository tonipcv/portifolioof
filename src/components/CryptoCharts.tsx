'use client'

import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
  }[]
}

export function CryptoCharts() {
  const [portfolioChartData, setPortfolioChartData] = useState<ChartData | null>(null)
  const [performanceChartData, setPerformanceChartData] = useState<ChartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/portfolio')
        if (!response.ok) throw new Error('Failed to fetch portfolio data')
        
        const data = await response.json()
        
        if (!data.cryptos || data.cryptos.length === 0) {
          setError('Nenhuma criptomoeda encontrada no portfolio')
          return
        }

        // Dados para o gráfico de composição do portfolio
        const portfolioData: ChartData = {
          labels: data.cryptos.map((crypto: any) => crypto.name),
          datasets: [{
            label: 'Valor Investido (R$)',
            data: data.cryptos.map((crypto: any) => crypto.investedAmount),
            backgroundColor: [
              'rgba(99, 102, 241, 0.5)',
              'rgba(168, 85, 247, 0.5)',
              'rgba(236, 72, 153, 0.5)',
              'rgba(59, 130, 246, 0.5)',
              'rgba(16, 185, 129, 0.5)'
            ],
            borderColor: [
              'rgba(99, 102, 241, 1)',
              'rgba(168, 85, 247, 1)',
              'rgba(236, 72, 153, 1)',
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)'
            ],
            borderWidth: 1
          }]
        }

        // Dados para o gráfico de performance
        const performanceData: ChartData = {
          labels: data.cryptos.map((crypto: any) => crypto.name),
          datasets: [{
            label: 'Lucro/Prejuízo (%)',
            data: data.cryptos.map((crypto: any) => 
              ((crypto.currentPrice - crypto.buyPrice) / crypto.buyPrice) * 100
            ),
            backgroundColor: data.cryptos.map((crypto: any) => 
              ((crypto.currentPrice - crypto.buyPrice) / crypto.buyPrice) >= 0
                ? 'rgba(34, 197, 94, 0.5)'
                : 'rgba(239, 68, 68, 0.5)'
            ),
            borderColor: data.cryptos.map((crypto: any) => 
              ((crypto.currentPrice - crypto.buyPrice) / crypto.buyPrice) >= 0
                ? 'rgb(34, 197, 94)'
                : 'rgb(239, 68, 68)'
            ),
            borderWidth: 1
          }]
        }

        setPortfolioChartData(portfolioData)
        setPerformanceChartData(performanceData)
        setError(null)
      } catch (error) {
        console.error('Error fetching portfolio data for charts:', error)
        setError('Erro ao carregar dados do portfolio')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div className="h-64 flex items-center justify-center">Carregando gráficos...</div>
  }

  if (error) {
    return <div className="text-red-400 p-4">{error}</div>
  }

  if (!portfolioChartData || !performanceChartData) {
    return <div className="text-gray-400 p-4">Nenhum dado disponível para exibição</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gray-800/30 p-6 rounded-lg">
        <h3 className="text-lg font-light mb-4">Composição do Portfolio</h3>
        <div className="h-64">
          <Pie
            data={portfolioChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: '#9CA3AF'
                  }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="bg-gray-800/30 p-6 rounded-lg">
        <h3 className="text-lg font-light mb-4">Performance por Crypto</h3>
        <div className="h-64">
          <Bar
            data={performanceChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  grid: {
                    color: 'rgba(75, 85, 99, 0.2)'
                  },
                  ticks: {
                    color: '#9CA3AF'
                  }
                },
                x: {
                  grid: {
                    display: false
                  },
                  ticks: {
                    color: '#9CA3AF'
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  )
} 