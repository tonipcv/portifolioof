'use client'

import { useState } from 'react'
import { Menu, X, Wallet, LineChart } from 'lucide-react'
import Link from 'next/link'
import { AuthStatus } from './AuthStatus'
import Image from 'next/image'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-[#222222] hover:text-blue-400 focus:outline-none"
      >
        <span className="sr-only">Abrir menu</span>
        {isOpen ? (
          <X className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="block h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* Mobile menu panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#111111] bg-opacity-95">
          <div className="fixed inset-y-0 right-0 w-full overflow-y-auto bg-[#161616] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/portfolios" className="-m-1.5 p-1.5">
                <span className="sr-only">Crypto Portfolio</span>
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-400 hover:text-blue-400"
              >
                <span className="sr-only">Fechar menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-800">
                <div className="space-y-2 py-6">
                  <Link
                    href="/portfolios"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-300 hover:bg-[#222222] hover:text-blue-400"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center">
                      <Wallet className="w-5 h-5 mr-3" />
                      Portfolios
                    </div>
                  </Link>
                  <Link
                    href="/market"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-300 hover:bg-[#222222] hover:text-blue-400"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center">
                      <LineChart className="w-5 h-5 mr-3" />
                      Mercado
                    </div>
                  </Link>
                </div>
                <div className="py-6">
                  <AuthStatus />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 