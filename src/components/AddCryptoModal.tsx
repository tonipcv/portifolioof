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
            'https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=400&page=1&sparkline=false&price_change_percentage=24h&locale=en',
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
                isCustom: false
              }
            ])
          )

          // 3. Buscar dados específicos para as moedas customizadas
          const customCoinsPromises = CUSTOM_COINS.map(async (customCoin) => {
            try {
              const response = await fetch(
                `https://pro-api.coingecko.com/api/v3/coins/${customCoin.id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
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
      
      console.log('Sending crypto data:', {
        coinId: selectedCrypto.id,
        symbol: selectedCrypto.symbol,
        name: selectedCrypto.name,
        amount: parseFloat(amount),
        investedValue: valueInUSD,
        portfolioId: portfolioId,
        image: selectedCrypto.image
      })
      
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
          image: selectedCrypto.image
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
          <div className="fixed inset-0 bg-[#111111]/80 transition-opacity" />
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
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-gray-800 text-gray-400 hover:text-gray-300"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fechar</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CurrencyDollarIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-white">
                      Adicionar Crypto
                    </Dialog.Title>
                    {error ? (
                      <div className="mt-2 text-red-400">{error}</div>
                    ) : (
                      <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Buscar Criptomoeda
                          </label>
                          <Combobox value={selectedCrypto} onChange={setSelectedCrypto}>
                            <div className="relative">
                              <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-gray-700 text-left focus:outline-none sm:text-sm">
                                <Combobox.Input
                                  className="w-full border-none bg-gray-700 py-2.5 pl-3 pr-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-600 rounded-lg"
                                  displayValue={(crypto: CryptoPrice) => crypto?.name || ''}
                                  onChange={(event) => setQuery(event.target.value)}
                                  placeholder="Digite para buscar..."
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
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
                                <Combobox.Options className="absolute mt-1 max-h-[400px] w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                                  {isLoading ? (
                                    <div key="loading" className="relative cursor-default select-none px-4 py-2 text-gray-300">
                                      Carregando...
                                    </div>
                                  ) : filteredCryptos.length === 0 ? (
                                    <div key="not-found" className="relative cursor-default select-none px-4 py-2 text-gray-300">
                                      Nada encontrado.
                                    </div>
                                  ) : (
                                    filteredCryptos.map((crypto) => (
                                      <Combobox.Option
                                        key={crypto.id}
                                        className={({ active }) =>
                                          `relative cursor-default select-none py-3 pl-10 pr-4 ${
                                            active ? 'bg-blue-600 text-white' : 'text-gray-300'
                                          }`
                                        }
                                        value={crypto}
                                      >
                                        {({ selected, active }) => (
                                          <>
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center">
                                                {crypto.image ? (
                                                  <Image
                                                    src={crypto.image}
                                                    alt={crypto.name}
                                                    width={24}
                                                    height={24}
                                                    className="rounded-full mr-3"
                                                  />
                                                ) : (
                                                  <div className="w-6 h-6 bg-gray-600 rounded-full mr-3 flex items-center justify-center">
                                                    <span className="text-xs text-gray-300">
                                                      {crypto.symbol.slice(0, 2).toUpperCase()}
                                                    </span>
                                                  </div>
                                                )}
                                                <div>
                                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                    {crypto.name}
                                                  </span>
                                                  <span className="text-sm text-gray-400">
                                                    {crypto.symbol.toUpperCase()}
                                                  </span>
                                                </div>
                                              </div>
                                              <span className="text-sm text-gray-400 ml-4">
                                                {formatUSD(crypto.current_price)}
                                              </span>
                                            </div>
                                            {selected ? (
                                              <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                  active ? 'text-white' : 'text-blue-600'
                                                }`}
                                              >
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                              </span>
                                            ) : null}
                                          </>
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
                          <div className="bg-[#222222] rounded-lg p-4 flex items-center gap-4">
                            <div className="w-6 h-6 bg-gray-600 rounded-full mr-2 flex items-center justify-center">
                              <span className="text-xs text-gray-300">
                                {selectedCrypto.symbol.slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{selectedCrypto.name}</h4>
                              <p className="text-gray-400">
                                {formatUSD(selectedCrypto.current_price)}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="investedValue" className="block text-sm font-medium text-gray-300">
                              Valor Investido
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-400 sm:text-sm">$</span>
                              </div>
                              <input
                                type="text"
                                id="investedValue"
                                className="block w-full rounded-md border-0 bg-gray-700 py-2.5 pl-10 text-white placeholder-gray-400 shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-blue-600 sm:text-sm"
                                value={formatInvestedValue(investedValue)}
                                onChange={(e) => handleValueChange(e.target.value)}
                                placeholder="0.00"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
                              Quantidade
                            </label>
                            <input
                              type="number"
                              id="amount"
                              step="any"
                              className="mt-2 block w-full rounded-md border-0 bg-gray-700 py-2.5 px-3 text-white placeholder-gray-400 shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-blue-600 sm:text-sm"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00"
                              required
                            />
                          </div>
                        </div>

                        <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading || !selectedCrypto}
                          >
                            {isLoading ? 'Carregando...' : 'Adicionar'}
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-700 px-3 py-2.5 text-sm font-semibold text-gray-300 shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-600 sm:mt-0 sm:w-auto"
                            onClick={onClose}
                          >
                            Cancelar
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