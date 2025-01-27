'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition, Combobox } from '@headlessui/react'
import { XMarkIcon, CurrencyDollarIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { CryptoPrice, getTopCryptos } from '@/lib/coingecko'
import Image from 'next/image';

interface AddCryptoModalProps {
  isOpen: boolean
  onClose: () => void
  portfolioId: string
  onSuccess?: () => void
}

interface CoinGeckoListItem {
  id: string;
  symbol: string;
  name: string;
}

interface EnrichedCrypto extends CryptoPrice {
  isCustom?: boolean;
  market_cap?: number;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  total_volume?: number;
}

const CUSTOM_COINS = [
  { id: 'popcat', symbol: 'POPCAT', name: 'Popcat (SOL)' },
  { id: 'dog-go-to-the-moon-rune', symbol: 'dog', name: 'DOG•GO•TO•THE•MOON (Runes)' },
  { id: 'ethena', symbol: 'ENA', name: 'Ethena' },
  { id: 'seal-sol', symbol: 'SEAL', name: 'Seal' },
  { id: 'cat-in-a-dogs-world', symbol: 'MEW', name: 'Cat in a dogs world' },
  { id: 'kangamoon', symbol: 'KANG', name: 'Kangamoon' },
  { id: 'slerf', symbol: 'SLERF', name: 'SLERF' },
  { id: 'goldfinch', symbol: 'GFI', name: 'Goldfinch' },
  { id: 'ankr', symbol: 'ANKR', name: 'Ankr' },
  { id: 'mantra-dao', symbol: 'OM', name: 'MANTRA' },
  { id: 'ubxs-token', symbol: 'UBXS', name: 'UBXS Token' },
  { id: 'realio-network', symbol: 'RIO', name: 'Realio Network' },
  { id: 'wen', symbol: 'WEN', name: 'Wen' },
  { id: 'lido-dao', symbol: 'LDO', name: 'Lido DAO' },
  { id: 'polytrade', symbol: 'TRADE', name: 'Polytrade' },
  { id: 'core', symbol: 'CORE', name: 'Core' },
  { id: 'centrifuge', symbol: 'CFG', name: 'Centrifuge' }
] as const;

export default function AddCryptoModal({ isOpen, onClose, portfolioId, onSuccess }: AddCryptoModalProps) {
  const [query, setQuery] = useState('')
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoPrice | null>(null)
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [investedValue, setInvestedValue] = useState('')

  useEffect(() => {
    async function loadCryptos() {
      if (isOpen) {
        setIsLoading(true)
        try {
          // 1. Primeiro, buscar a lista completa de moedas
          const listResponse = await fetch(
            'https://pro-api.coingecko.com/api/v3/coins/list',
            {
              headers: {
                'accept': 'application/json',
                'x-cg-pro-api-key': 'CG-hpbLQhyhxzcJJyUkjQdBjkPc'
              }
            }
          )

          if (!listResponse.ok) {
            throw new Error('Falha ao carregar lista de criptomoedas')
          }

          const allCoins: CoinGeckoListItem[] = await listResponse.json()

          // 2. Buscar dados de mercado para as top 400
          const topCoinsResponse = await fetch(
            'https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=400&page=1&sparkline=false&price_change_percentage=24h,7d',
            {
              headers: {
                'accept': 'application/json',
                'x-cg-pro-api-key': 'CG-hpbLQhyhxzcJJyUkjQdBjkPc'
              }
            }
          )

          if (!topCoinsResponse.ok) {
            throw new Error('Falha ao carregar dados de mercado')
          }

          const topCoinsData = await topCoinsResponse.json()
          
          // Criar mapa com os dados das top coins
          const topCoinsMap = new Map(
            topCoinsData.map((coin: any) => [
              coin.id,
              {
                id: coin.id,
                symbol: coin.symbol,
                name: coin.name,
                image: coin.image || coin.thumb || coin.small || '',
                current_price: coin.current_price,
                price_change_percentage_24h: coin.price_change_percentage_24h,
                price_change_percentage_7d: coin.price_change_percentage_7d_in_currency,
                isCustom: false
              }
            ])
          )

          // 3. Buscar dados específicos para as moedas customizadas
          const customCoinsPromises = CUSTOM_COINS.map(async (customCoin) => {
            try {
              const response = await fetch(
                `https://pro-api.coingecko.com/api/v3/coins/${customCoin.id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`,
                {
                  headers: {
                    'accept': 'application/json',
                    'x-cg-pro-api-key': 'CG-hpbLQhyhxzcJJyUkjQdBjkPc'
                  }
                }
              )
              
              if (!response.ok) {
                return {
                  id: customCoin.id,
                  symbol: customCoin.symbol,
                  name: customCoin.name,
                  image: '',
                  current_price: 0,
                  price_change_percentage_24h: 0,
                  price_change_percentage_7d: 0,
                  isCustom: true
                }
              }

              const data = await response.json()
              const imageUrl = data.image?.large || data.image?.small || data.image?.thumb || ''
              
              return {
                id: data.id,
                symbol: data.symbol,
                name: data.name,
                image: imageUrl,
                current_price: data.market_data?.current_price?.usd || 0,
                price_change_percentage_24h: data.market_data?.price_change_percentage_24h || 0,
                price_change_percentage_7d: data.market_data?.price_change_percentage_7d || 0,
                isCustom: true
              }
            } catch (error) {
              console.error(`Erro ao buscar dados para ${customCoin.name}:`, error)
              return {
                id: customCoin.id,
                symbol: customCoin.symbol,
                name: customCoin.name,
                image: '',
                current_price: 0,
                price_change_percentage_24h: 0,
                price_change_percentage_7d: 0,
                isCustom: true
              }
            }
          })

          const customCoinsData = await Promise.all(customCoinsPromises)

          // 4. Combinar todas as moedas
          const allEnrichedCoins = [
            ...customCoinsData,
            ...Array.from(topCoinsMap.values())
          ] as EnrichedCrypto[]

          // 5. Ordenar: primeiro as customizadas, depois por nome
          const sortedCoins = allEnrichedCoins.sort((a: EnrichedCrypto, b: EnrichedCrypto) => {
            if (a.isCustom && !b.isCustom) return -1
            if (!a.isCustom && b.isCustom) return 1
            return a.name.localeCompare(b.name)
          })

          setCryptos(sortedCoins)
        } catch (err) {
          setError('Falha ao carregar criptomoedas')
          console.error(err)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadCryptos()
  }, [isOpen])

  const filteredCryptos = query === ''
    ? cryptos
    : cryptos.filter((crypto) => {
        const searchLower = query.toLowerCase()
        return crypto.name.toLowerCase().includes(searchLower) ||
               crypto.symbol.toLowerCase().includes(searchLower)
      })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCrypto) return

    try {
      const valueInUSD = parseFloat(investedValue) / 100
      
      const response = await fetch('/api/crypto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coinId: selectedCrypto.id,
          symbol: selectedCrypto.symbol,
          name: selectedCrypto.name,
          amount: parseFloat(amount),
          investedValue: valueInUSD,
          portfolioId: portfolioId,
          image: selectedCrypto.image,
          currentPrice: selectedCrypto.current_price,
          priceChangePercentage24h: selectedCrypto.price_change_percentage_24h,
          priceChangePercentage7d: selectedCrypto.price_change_percentage_7d
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add crypto')
      }

      onClose()
      setSelectedCrypto(null)
      setAmount('')
      setInvestedValue('')
      setQuery('')
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error adding crypto:', error)
      setError('Falha ao adicionar criptomoeda')
    }
  }

  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatInvestedValue = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, '')
    if (!onlyNumbers) return '$0.00'
    
    const numberValue = Number(onlyNumbers) / 100
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numberValue)
  }

  const handleValueChange = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, '')
    setInvestedValue(onlyNumbers)
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-[#161616] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="text-zinc-400 hover:text-zinc-300 transition-colors"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fechar</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-light text-zinc-100 mb-6">
                      Adicionar Crypto
                    </Dialog.Title>
                    {error ? (
                      <div className="mt-2 text-red-400 text-sm">{error}</div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-light text-zinc-300">
                            Buscar Criptomoeda
                          </label>
                          <Combobox value={selectedCrypto} onChange={setSelectedCrypto}>
                            <div className="relative">
                              <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white/5 text-left focus:outline-none sm:text-sm">
                                <Combobox.Input
                                  className="w-full border-0 bg-transparent py-2.5 pl-3 pr-10 text-zinc-100 placeholder-zinc-500 focus:ring-1 focus:ring-white/20 rounded-lg text-sm font-light"
                                  displayValue={(crypto: CryptoPrice) => crypto?.name || ''}
                                  onChange={(event) => setQuery(event.target.value)}
                                  placeholder="Digite para buscar..."
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-4 w-4 text-zinc-400"
                                    aria-hidden="true"
                                  />
                                </Combobox.Button>
                              </div>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                afterLeave={() => setQuery('')}
                              >
                                <Combobox.Options className="absolute mt-1 max-h-[400px] w-full overflow-auto rounded-lg bg-[#161616] py-1 text-base shadow-lg ring-1 ring-white/10 focus:outline-none sm:text-sm z-50">
                                  {isLoading ? (
                                    <div className="relative cursor-default select-none px-4 py-2 text-zinc-400 text-sm">
                                      Carregando...
                                    </div>
                                  ) : filteredCryptos.length === 0 ? (
                                    <div className="relative cursor-default select-none px-4 py-2 text-zinc-400 text-sm">
                                      Nada encontrado.
                                    </div>
                                  ) : (
                                    filteredCryptos.map((crypto) => (
                                      <Combobox.Option
                                        key={crypto.id}
                                        className={({ active }) =>
                                          `relative cursor-default select-none py-3 pl-3 pr-4 ${
                                            active ? 'bg-white/5' : ''
                                          }`
                                        }
                                        value={crypto}
                                      >
                                        {({ selected, active }) => (
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                              <div className="w-6 h-6 bg-white/5 rounded-full mr-3 flex items-center justify-center">
                                                <span className="text-xs text-zinc-400">
                                                  {crypto.symbol.slice(0, 2).toUpperCase()}
                                                </span>
                                              </div>
                                              <div>
                                                <span className={`block text-sm text-zinc-100 font-light`}>
                                                  {crypto.name}
                                                </span>
                                                <span className="text-xs text-zinc-500">
                                                  {crypto.symbol.toUpperCase()}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <div className="text-sm text-zinc-400 font-light">
                                                {formatUSD(crypto.current_price)}
                                              </div>
                                              <div className="flex items-center gap-2 text-xs">
                                                <span className={crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                                                  {crypto.price_change_percentage_24h?.toFixed(2)}%
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </Combobox.Option>
                                    ))
                                  )}
                                </Combobox.Options>
                              </Transition>
                            </div>
                          </Combobox>
                        </div>

                        {selectedCrypto && (
                          <div className="bg-white/5 rounded-lg p-4 flex items-center gap-4">
                            <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center">
                              <span className="text-xs text-zinc-400">
                                {selectedCrypto.symbol.slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-zinc-100 text-sm font-light">{selectedCrypto.name}</h4>
                              <p className="text-zinc-400 text-xs">
                                {formatUSD(selectedCrypto.current_price)}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="investedValue" className="block text-sm font-light text-zinc-300">
                              Valor Investido
                            </label>
                            <div className="relative mt-2 rounded-md">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-zinc-500 sm:text-sm">$</span>
                              </div>
                              <input
                                type="text"
                                id="investedValue"
                                className="block w-full rounded-lg border-0 bg-white/5 py-2 pl-8 text-zinc-100 placeholder-zinc-500 focus:ring-1 focus:ring-white/20 text-sm font-light"
                                value={formatInvestedValue(investedValue)}
                                onChange={(e) => handleValueChange(e.target.value)}
                                placeholder="0.00"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="amount" className="block text-sm font-light text-zinc-300">
                              Quantidade
                            </label>
                            <input
                              type="number"
                              id="amount"
                              step="any"
                              className="mt-2 block w-full rounded-lg border-0 bg-white/5 py-2 px-3 text-zinc-100 placeholder-zinc-500 focus:ring-1 focus:ring-white/20 text-sm font-light"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                          <button
                            type="button"
                            className="px-4 py-2 text-sm font-light text-zinc-300 hover:text-zinc-100 transition-colors"
                            onClick={onClose}
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm text-zinc-100 transition-colors font-light disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading || !selectedCrypto}
                          >
                            {isLoading ? 'Carregando...' : 'Adicionar'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 