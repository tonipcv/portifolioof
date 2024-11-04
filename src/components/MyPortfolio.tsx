'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'

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

export default function MyPortfolio({ portfolioId }: MyPortfolioProps) {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`/api/portfolio?portfolioId=${portfolioId}`)
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
  }, [portfolioId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="h-[300px] bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>
  }

  if (!data) {
    return <div className="text-center p-4 text-gray-400">No data available</div>
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Valor do Portfólio',
        data: data.values,
        borderColor: data.profitLoss >= 0 ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)', // green-500 : red-500
        backgroundColor: data.profitLoss >= 0 
          ? 'rgba(34, 197, 94, 0.1)' 
          : 'rgba(239, 68, 68, 0.1)',
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
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.15)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return formatBRL(value)
          },
          padding: 8,
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
          },
          maxRotation: 0,
          padding: 8,
        },
        border: {
          display: false,
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400">Valor Total</p>
          <p className="text-xl font-bold text-white mt-1">
            {formatBRL(data.totalValue)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {data.change24h >= 0 ? (
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4 text-red-400" />
            )}
            <span className={`text-sm ${
              data.change24h >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatPercentage(data.change24h)}
            </span>
            <span className="text-gray-500 text-sm">24h</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400">Total Investido</p>
          <p className="text-xl font-bold text-white mt-1">
            {formatBRL(data.totalInvested)}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400">Lucro/Prejuízo</p>
          <p className={`text-xl font-bold mt-1 ${
            data.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatBRL(data.profitLoss)}
          </p>
          <p className={`text-sm ${
            data.profitLossPercentage >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatPercentage(data.profitLossPercentage)}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400">Ativos</p>
          <p className="text-xl font-bold text-white mt-1">
            {data.values.length}
          </p>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <Line data={chartData} options={options} />
      </div>

      <div className="flex gap-2 justify-center">
        <button className="px-3 py-1 text-sm text-gray-400 hover:text-white bg-gray-800 rounded-md transition-colors">
          1D
        </button>
        <button className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md">
          1S
        </button>
        <button className="px-3 py-1 text-sm text-gray-400 hover:text-white bg-gray-800 rounded-md transition-colors">
          1M
        </button>
        <button className="px-3 py-1 text-sm text-gray-400 hover:text-white bg-gray-800 rounded-md transition-colors">
          1A
        </button>
        <button className="px-3 py-1 text-sm text-gray-400 hover:text-white bg-gray-800 rounded-md transition-colors">
          Tudo
        </button>
      </div>
    </div>
  )
} 