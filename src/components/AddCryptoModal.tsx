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
          const data = await getTopCryptos()
          setCryptos(data)
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
        return crypto.name.toLowerCase().includes(query.toLowerCase()) ||
               crypto.symbol.toLowerCase().includes(query.toLowerCase())
      })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCrypto) return

    try {
      console.log('Submitting crypto:', {
        coinId: selectedCrypto.id,
        symbol: selectedCrypto.symbol,
        name: selectedCrypto.name,
        amount: parseFloat(amount),
        investedValue: parseFloat(investedValue) / 100,
        portfolioId
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
          investedValue: parseFloat(investedValue) / 100,
          portfolioId: portfolioId
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

  const formatBRL = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, '')
    if (!onlyNumbers) return 'R$ 0,00'
    
    const numberValue = Number(onlyNumbers) / 100
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
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
                                  className="w-full border-none bg-gray-700 py-2.5 pl-3 pr-10 text-white focus:ring-2 focus:ring-blue-600 rounded-lg"
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
                                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {filteredCryptos.length === 0 && query !== '' ? (
                                    <div className="relative cursor-default select-none px-4 py-2 text-gray-300">
                                      Nada encontrado.
                                    </div>
                                  ) : (
                                    filteredCryptos.map((crypto) => (
                                      <Combobox.Option
                                        key={crypto.id}
                                        className={({ active }) =>
                                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? 'bg-blue-600 text-white' : 'text-gray-300'
                                          }`
                                        }
                                        value={crypto}
                                      >
                                        {({ selected, active }) => (
                                          <>
                                            <div className="flex items-center">
                                              <Image 
                                                src={crypto.image} 
                                                alt={crypto.name}
                                                width={24} 
                                                height={24}
                                                className="mr-2"
                                              />
                                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                {crypto.name} ({crypto.symbol.toUpperCase()})
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
                          <div className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-4">
                            <Image 
                              src={selectedCrypto.image} 
                              alt={selectedCrypto.name}
                              width={24} 
                              height={24}
                              className="mr-2"
                            />
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
                                <span className="text-gray-400 sm:text-sm">R$</span>
                              </div>
                              <input
                                type="text"
                                id="investedValue"
                                className="block w-full rounded-md border-0 bg-gray-700 py-2.5 pl-10 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-blue-600 sm:text-sm"
                                value={formatBRL(investedValue)}
                                onChange={(e) => handleValueChange(e.target.value)}
                                placeholder="0,00"
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
                              className="mt-2 block w-full rounded-md border-0 bg-gray-700 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-blue-600 sm:text-sm"
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