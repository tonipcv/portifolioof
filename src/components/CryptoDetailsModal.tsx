'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Crypto } from '@prisma/client'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'

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
                          alt={crypto.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                          unoptimized
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-lg text-gray-300">
                            {crypto.symbol.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
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