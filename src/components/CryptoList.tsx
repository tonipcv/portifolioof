'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Image from 'next/image';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  image: string;
}

export function CryptoList() {
  const router = useRouter()
  const [cryptos, setCryptos] = useState<CryptoData[]>([])
  const [filteredCryptos, setFilteredCryptos] = useState<CryptoData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [cryptoAmount, setCryptoAmount] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isComboboxOpen, setIsComboboxOpen] = useState(false)

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await fetch('/api/crypto')
        if (!response.ok) throw new Error('Failed to fetch data')
        const data = await response.json()
        setCryptos(data)
        setFilteredCryptos(data)
      } catch (err) {
        setError('Failed to load cryptocurrency data')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCryptos()
  }, [])

  useEffect(() => {
    const filtered = cryptos.filter(crypto => 
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCryptos(filtered)
  }, [searchTerm, cryptos])

  // Atualiza o valor investido quando a quantidade muda
  const handleAmountChange = (amount: string) => {
    setCryptoAmount(amount)
    if (selectedCrypto && amount) {
      const invested = parseFloat(amount) * selectedCrypto.current_price
      setInvestmentAmount(invested.toFixed(2))
    } else {
      setInvestmentAmount('')
    }
  }

  // Atualiza a quantidade quando o valor investido muda
  const handleInvestmentChange = (value: string) => {
    setInvestmentAmount(value)
    if (selectedCrypto && value) {
      const amount = parseFloat(value) / selectedCrypto.current_price
      setCryptoAmount(amount.toFixed(8))
    } else {
      setCryptoAmount('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCrypto) return

    try {
      const response = await fetch('/api/crypto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedCrypto.name,
          symbol: selectedCrypto.symbol,
          amount: parseFloat(cryptoAmount),
          buyPrice: selectedCrypto.current_price,
          currentPrice: selectedCrypto.current_price,
          investedAmount: parseFloat(investmentAmount),
          imageUrl: selectedCrypto.image
        }),
      })

      if (!response.ok) throw new Error('Failed to add crypto')
      router.push('/')
    } catch (error) {
      console.error('Error adding crypto:', error)
    }
  }

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="relative">
          <label className="block text-sm font-medium mb-2">Buscar Criptomoeda</label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setIsComboboxOpen(true)
              }}
              onFocus={() => setIsComboboxOpen(true)}
              className="w-full p-2 pl-10 rounded bg-gray-700 border border-gray-600"
              placeholder="Digite o nome ou símbolo..."
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          {isComboboxOpen && searchTerm && (
            <div className="absolute z-10 w-full mt-1 bg-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredCryptos.map((crypto) => (
                <div
                  key={crypto.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-600 cursor-pointer"
                  onClick={() => {
                    setSelectedCrypto(crypto)
                    setSearchTerm(`${crypto.name} (${crypto.symbol.toUpperCase()})`)
                    setIsComboboxOpen(false)
                    setInvestmentAmount('')
                    setCryptoAmount('')
                  }}
                >
                  <Image 
                    src={crypto.image} 
                    alt={crypto.name}
                    width={32} 
                    height={32}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{crypto.name}</div>
                    <div className="text-sm text-gray-400">{crypto.symbol.toUpperCase()}</div>
                  </div>
                  <div className="ml-auto text-sm">
                    R$ {crypto.current_price.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedCrypto && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3 mb-6">
                <Image 
                  src={selectedCrypto.image} 
                  alt={selectedCrypto.name}
                  width={24} 
                  height={24}
                  className="mr-2"
                />
                <div>
                  <h3 className="font-medium">{selectedCrypto.name}</h3>
                  <p className="text-sm text-gray-400">
                    Preço Atual: R$ {selectedCrypto.current_price.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantidade de {selectedCrypto.symbol.toUpperCase()}
                  </label>
                  <input
                    type="number"
                    value={cryptoAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                    placeholder="Ex: 0.5"
                    required
                    min="0"
                    step="any"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium mb-2">
                    Valor Total (BRL)
                  </label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => handleInvestmentChange(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                    placeholder="R$ 0,00"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="p-3 bg-gray-600/50 rounded">
                  <h4 className="text-sm font-medium mb-2">Resumo da Operação</h4>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p>Criptomoeda: {selectedCrypto.name}</p>
                    <p>Quantidade: {cryptoAmount || '0'} {selectedCrypto.symbol.toUpperCase()}</p>
                    <p>Valor Investido: R$ {investmentAmount ? parseFloat(investmentAmount).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }) : '0,00'}</p>
                    <p>Preço Unitário: R$ {selectedCrypto.current_price.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</p>
                    <div className="mt-2 pt-2 border-t border-gray-600">
                      <p className="font-medium text-base mb-1">Projeção de Valorização</p>
                      <div className="space-y-1">
                        <p>
                          +5%: R$ {(parseFloat(investmentAmount || '0') * 1.05).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </p>
                        <p>
                          +10%: R$ {(parseFloat(investmentAmount || '0') * 1.10).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </p>
                        <p>
                          +25%: R$ {(parseFloat(investmentAmount || '0') * 1.25).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </p>
                        <p>
                          +50%: R$ {(parseFloat(investmentAmount || '0') * 1.50).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </p>
                        <p>
                          +100%: R$ {(parseFloat(investmentAmount || '0') * 2).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-600">
                      <p className="font-medium text-base mb-1">Projeção de Desvalorização</p>
                      <div className="space-y-1">
                        <p className="text-red-400">
                          -5%: R$ {(parseFloat(investmentAmount || '0') * 0.95).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </p>
                        <p className="text-red-400">
                          -10%: R$ {(parseFloat(investmentAmount || '0') * 0.90).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </p>
                        <p className="text-red-400">
                          -25%: R$ {(parseFloat(investmentAmount || '0') * 0.75).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </p>
                        <p className="text-red-400">
                          -50%: R$ {(parseFloat(investmentAmount || '0') * 0.50).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded-lg transition-colors"
            >
              Adicionar ao Portfolio
            </button>
          </form>
        )}
      </div>
    </div>
  )
} 