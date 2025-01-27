'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { ChartBarIcon } from '@heroicons/react/24/outline'

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
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  
  if (isToday) {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })
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
        console.log('Fetching portfolio data...', {
          portfolioId,
          selectedPeriod,
          url: `/api/portfolio/${portfolioId}/history?period=${selectedPeriod}`
        });

        const response = await fetch(`/api/portfolio/${portfolioId}/history?period=${selectedPeriod}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Portfolio API Error:', {
            status: response.status,
            statusText: response.statusText,
            responseBody: errorText,
            url: response.url
          });
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const jsonData = await response.json();
        console.log('Portfolio data received:', jsonData);
        
        if (!jsonData.labels || !jsonData.values || 
            !Array.isArray(jsonData.labels) || !Array.isArray(jsonData.values)) {
          console.error('Invalid data structure:', jsonData);
          throw new Error('Invalid data structure received from API');
        }

        setData(jsonData);
        setError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        console.error('Portfolio fetch error:', {
          error,
          message: errorMessage,
          portfolioId,
          selectedPeriod
        });
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [portfolioId, selectedPeriod]);

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
    labels: data.labels.map(formatDate),
    datasets: [
      {
        label: 'Valor do Portfólio',
        data: data.values,
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 400)
          gradient.addColorStop(0, 'rgba(34, 197, 94, 0.2)')
          gradient.addColorStop(1, 'rgba(34, 197, 94, 0.0)')
          return gradient
        },
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHitRadius: 20,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointHoverBorderColor: '#fff',
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
        backgroundColor: 'rgba(17, 17, 17, 0.95)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        padding: {
          top: 12,
          right: 16,
          bottom: 12,
          left: 16
        },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        displayColors: false,
        cornerRadius: 8,
        bodyFont: {
          family: 'Helvetica, Arial, sans-serif',
          size: 14,
          weight: '600'
        },
        titleFont: {
          family: 'Helvetica, Arial, sans-serif',
          size: 12,
          weight: '400'
        },
        callbacks: {
          title: function(tooltipItems: any) {
            return tooltipItems[0].label
          },
          label: function(context: any) {
            return `Valor: ${formatBRL(context.parsed.y)}`
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        grid: {
          color: 'rgba(255, 255, 255, 0.06)',
          drawBorder: false,
          lineWidth: 0.5
        },
        ticks: {
          color: 'rgb(161, 161, 170)',
          font: {
            size: 11,
            family: 'Helvetica, Arial, sans-serif',
            weight: '500'
          },
          callback: function(value: any) {
            const formattedValue = formatBRL(value)
            // Em telas menores, mostra valor abreviado
            if (window.innerWidth < 768) {
              return formattedValue.replace(',00', '').replace('R$', '')
            }
            return formattedValue
          },
          padding: 8,
          maxTicksLimit: 6,
        },
        border: {
          display: false,
        }
      },
      x: {
        type: 'category' as const,
        grid: {
          color: 'rgba(255, 255, 255, 0.06)',
          drawBorder: false,
          lineWidth: 0.5,
          display: true
        },
        ticks: {
          color: 'rgb(161, 161, 170)',
          font: {
            size: 11,
            family: 'Helvetica, Arial, sans-serif',
            weight: '500'
          },
          maxRotation: 0,
          minRotation: 0,
          padding: 8,
          maxTicksLimit: 6,
          autoSkip: true,
        },
        border: {
          display: false,
        }
      }
    }
  }

  return (
    <div className="space-y-4 font-['Helvetica']">
      <div className="bg-[#111111] rounded-lg p-3 sm:p-6 ring-1 ring-white/10">
        <div className="flex justify-end mb-4 sm:mb-6 overflow-x-auto pb-2 sm:pb-0 -mx-3 sm:mx-0 px-3 sm:px-0">
          <div className="inline-flex rounded-lg bg-black/40 p-0.5 sm:p-1">
            {PERIODS.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`group relative px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedPeriod === period.value
                    ? 'bg-green-500/20 text-green-400'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {period.label}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-white bg-black/90 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium">
                  {period.description}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-[250px] sm:h-[400px] w-full">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  )
} 