'use client'

import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Crypto } from '@prisma/client'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type Period = '1' | '7' | '30' | '365'

const periods = [
  { value: '1', label: '1D' },
  { value: '7', label: '7D' },
  { value: '30', label: '30D' },
  { value: '365', label: '1A' },
] as const

interface CryptoDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  crypto: Crypto | null
  onDelete?: (id: string) => void
  showDeleteButton?: boolean
}

const formatUSD = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

export default function CryptoDetailsModal({ 
  isOpen, 
  onClose, 
  crypto,
  onDelete,
  showDeleteButton
}: CryptoDetailsModalProps) {
  const [chartData, setChartData] = useState<any>(null)
  const [isLoadingChart, setIsLoadingChart] = useState(false)
  const [chartError, setChartError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('7')

  useEffect(() => {
    async function fetchChartData() {
      if (!crypto?.coinId || !isOpen) return
      
      setIsLoadingChart(true)
      setChartError(null)
      
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${crypto.coinId}/market_chart?vs_currency=usd&days=${selectedPeriod}`
        )
        
        if (!response.ok) throw new Error('Falha ao carregar dados do gráfico')
        
        const data = await response.json()
        
        const formatDate = (timestamp: number) => {
          const date = new Date(timestamp)
          if (selectedPeriod === '1') {
            return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          } else if (selectedPeriod === '7') {
            return date.toLocaleDateString('pt-BR', { weekday: 'short' })
          } else if (selectedPeriod === '30') {
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
          } else {
            return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
          }
        }

        let prices = data.prices
        if (selectedPeriod === '365') {
          prices = prices.filter((_: any, index: number) => index % 7 === 0)
        } else if (selectedPeriod === '30') {
          prices = prices.filter((_: any, index: number) => index % 2 === 0)
        }
        
        setChartData({
          labels: prices.map((price: [number, number]) => formatDate(price[0])),
          datasets: [{
            label: 'Preço (USD)',
            data: prices.map((price: [number, number]) => price[1]),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: selectedPeriod === '1' ? 1 : 0,
            pointHoverRadius: 4,
          }]
        })
      } catch (error) {
        console.error('Error fetching chart data:', error)
        setChartError('Erro ao carregar dados do gráfico')
      } finally {
        setIsLoadingChart(false)
      }
    }

    fetchChartData()
  }, [crypto?.coinId, isOpen, selectedPeriod])

  if (!crypto) return null

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#161616] p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-200">
                    {crypto.name}
                  </Dialog.Title>
                  {showDeleteButton && onDelete && (
                    <button
                      onClick={() => {
                        onDelete(crypto.id)
                        onClose()
                      }}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-full hover:bg-red-400/10"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="mt-4">
                  <div className="bg-[#222222] rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      {crypto.image ? (
                        <Image
                          src={crypto.image}
                          alt={crypto.name ?? ''}
                          width={48}
                          height={48}
                          className="rounded-full"
                          unoptimized
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-lg text-gray-300">
                            {crypto.symbol?.slice(0, 2).toUpperCase() ?? '??'}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="text-lg font-medium text-white">{crypto.name ?? 'Sem nome'}</h4>
                        <p className="text-gray-400">{crypto.symbol?.toUpperCase() ?? '???'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div>
                        <p className="text-sm text-gray-400">Preço Atual</p>
                        <p className="text-lg font-medium text-white">
                          {formatUSD(crypto.currentPrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Quantidade</p>
                        <p className="text-lg font-medium text-white">
                          {crypto.amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Valor Investido</p>
                        <p className="text-lg font-medium text-white">
                          {formatUSD(crypto.investedValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Lucro/Prejuízo</p>
                        <p className={`text-lg font-medium ${
                          crypto.profit >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {formatUSD(crypto.profit)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Variação 24h</p>
                          <p className={`text-lg font-medium ${
                            (crypto.priceChangePercentage24h ?? 0) >= 0 
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`}>
                            {crypto.priceChangePercentage24h?.toFixed(2) ?? 'N/A'}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Variação 7d</p>
                          <p className={`text-lg font-medium ${
                            (crypto.priceChangePercentage7d ?? 0) >= 0 
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`}>
                            {crypto.priceChangePercentage7d?.toFixed(2) ?? 'N/A'}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="bg-[#222222] rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-medium text-gray-200">
                        Histórico de Preço
                      </h3>
                      <div className="flex gap-2">
                        {periods.map(({ value, label }) => (
                          <button
                            key={value}
                            onClick={() => setSelectedPeriod(value as Period)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                              selectedPeriod === value
                                ? 'bg-green-500 text-white'
                                : 'bg-[#333333] text-gray-400 hover:bg-[#444444]'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="h-[300px]">
                      {isLoadingChart && (
                        <div className="h-full flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      
                      {chartError && (
                        <div className="h-full flex items-center justify-center text-red-400">
                          {chartError}
                        </div>
                      )}
                      
                      {chartData && !isLoadingChart && !chartError && (
                        <Line
                          data={chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            interaction: {
                              intersect: false,
                              mode: 'index'
                            },
                            plugins: {
                              legend: {
                                display: false
                              },
                              tooltip: {
                                backgroundColor: 'rgba(17, 17, 17, 0.9)',
                                titleColor: '#fff',
                                bodyColor: '#fff',
                                padding: 12,
                                borderColor: 'rgba(75, 85, 99, 0.2)',
                                borderWidth: 1,
                                displayColors: false,
                                callbacks: {
                                  label: (context) => `$${context.parsed.y.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  })}`
                                }
                              }
                            },
                            scales: {
                              y: {
                                grid: {
                                  color: 'rgba(75, 85, 99, 0.2)'
                                },
                                ticks: {
                                  color: '#9CA3AF',
                                  callback: (value) => `$${value.toLocaleString()}`
                                },
                                border: {
                                  display: false
                                }
                              },
                              x: {
                                grid: {
                                  display: false
                                },
                                ticks: {
                                  color: '#9CA3AF',
                                  maxRotation: 0
                                },
                                border: {
                                  display: false
                                }
                              }
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full rounded-md bg-[#222222] px-4 py-2 text-sm font-medium text-gray-200 hover:bg-[#333333] transition-colors"
                    onClick={onClose}
                  >
                    Fechar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 