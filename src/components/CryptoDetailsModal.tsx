'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Crypto } from '@prisma/client'

interface CryptoDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  crypto: Crypto | null
}

const formatUSD = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

export default function CryptoDetailsModal({ isOpen, onClose, crypto }: CryptoDetailsModalProps) {
  if (!crypto) return null

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
                    className="rounded-md bg-[#161616] text-gray-400 hover:text-gray-300"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fechar</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-white mb-4">
                      Detalhes da Criptomoeda
                    </Dialog.Title>

                    <div className="bg-[#222222] rounded-lg p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-lg text-gray-300">
                            {crypto.symbol.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-white">{crypto.name}</h4>
                          <p className="text-gray-400">{crypto.symbol.toUpperCase()}</p>
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
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 