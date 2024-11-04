'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, SparklesIcon, BanknotesIcon, ScaleIcon, ChartBarIcon } from '@heroicons/react/24/outline'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface PortfolioData {
  labels: string[]
  values: number[]
  change24h: number
  totalValue: number
  totalInvested: number
  profitLoss: number
  profitLossPercentage: number
}

const formatBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatPercentage = (value: number) => {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
}

interface MyPortfolioProps {
  portfolioId: string
}

const PERIODS = [
  { label: '1D', value: '1d', description: 'Últimas 24 horas' },
  { label: '1S', value: '1w', description: 'Últimos 7 dias' },
  { label: '1M', value: '1m', description: 'Últimos 30 dias' },
  { label: '1A', value: '1y', description: 'Último ano' },
  { label: 'Tudo', value: 'all', description: 'Histórico completo' }
] as const

export default function MyPortfolio({ portfolioId }: MyPortfolioProps) {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<typeof PERIODS[number]['value']>('1w')

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`/api/portfolio?portfolioId=${portfolioId}&period=${selectedPeriod}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const jsonData = await response.json()
        
        if (!jsonData.labels || !jsonData.values || 
            !Array.isArray(jsonData.labels) || !Array.isArray(jsonData.values)) {
          throw new Error('Invalid data structure received from API')
        }

        setData(jsonData)
        setError(null)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
        setError(errorMessage)
        console.error('Error fetching portfolio:', errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortfolio()
  }, [portfolioId, selectedPeriod])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse space-y-8 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4 h-24" />
            ))}
          </div>
          <div className="h-[300px] bg-gray-800 rounded-lg" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg">
        <ChartBarIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <div className="text-red-400">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg">
        <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <div className="text-gray-400">Nenhum dado disponível</div>
      </div>
    )
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Valor do Portfólio',
        data: data.values,
        borderColor: data.profitLoss >= 0 ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 300)
          if (data.profitLoss >= 0) {
            gradient.addColorStop(0, 'rgba(34, 197, 94, 0.5)')
            gradient.addColorStop(1, 'rgba(34, 197, 94, 0)')
          } else {
            gradient.addColorStop(0, 'rgba(239, 68, 68, 0.5)')
            gradient.addColorStop(1, 'rgba(239, 68, 68, 0)')
          }
          return gradient
        },
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: data.profitLoss >= 0 ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)',
        pointHoverBorderColor: 'rgba(255, 255, 255, 0.8)',
        pointHoverBorderWidth: 2,
      }
    ]
  }

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        padding: 12,
        borderColor: 'rgba(55, 65, 81, 0.9)',
        borderWidth: 1,
        displayColors: false,
        cornerRadius: 8,
        callbacks: {
          title: function() {
            return 'Valor do Portfólio'
          },
          label: function(context: any) {
            return formatBRL(context.parsed.y)
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        grid: {
          color: 'rgba(75, 85, 99, 0.15)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 11,
            family: 'Inter var',
          },
          callback: function(value: any) {
            return formatBRL(value)
          },
          padding: 8,
          maxTicksLimit: 5,
        },
        border: {
          display: false,
        }
      },
      x: {
        type: 'category' as const,
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 11,
            family: 'Inter var',
          },
          maxRotation: 0,
          padding: 8,
          maxTicksLimit: 8,
          autoSkip: true,
        },
        border: {
          display: false,
        }
      }
    }
  }

  const stats = [
    {
      name: 'Valor Total',
      value: formatBRL(data.totalValue),
      change: data.change24h,
      icon: SparklesIcon,
      changeLabel: '24h'
    },
    {
      name: 'Total Investido',
      value: formatBRL(data.totalInvested),
      icon: BanknotesIcon
    },
    {
      name: 'Lucro/Prejuízo',
      value: formatBRL(data.profitLoss),
      change: data.profitLossPercentage,
      icon: ScaleIcon
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 ring-1 ring-white/5"
          >
            <div className="flex items-center gap-4">
              <stat.icon className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">{stat.name}</p>
                <p className={`text-xl font-semibold mt-1 ${
                  stat.name === 'Lucro/Prejuízo' 
                    ? (data.profitLoss >= 0 ? 'text-green-400' : 'text-red-400')
                    : 'text-white'
                }`}>
                  {stat.value}
                </p>
                {stat.change !== undefined && (
                  <div className="flex items-center gap-1 mt-1">
                    {stat.change >= 0 ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-400" />
                    )}
                    <span className={`text-sm ${
                      stat.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatPercentage(stat.change)}
                    </span>
                    {stat.changeLabel && (
                      <span className="text-gray-500 text-sm">{stat.changeLabel}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 ring-1 ring-white/5">
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-lg bg-gray-900 p-1">
            {PERIODS.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`group relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedPeriod === period.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {period.label}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {period.description}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  )
} 