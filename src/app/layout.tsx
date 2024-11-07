import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Wallet, LineChart } from 'lucide-react'
import Image from 'next/image'
import { NextAuthProvider } from '@/providers/NextAuthProvider'
import { AuthStatus } from '@/components/AuthStatus'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Crypto Portfolio',
  description: 'Gerencie seu portfólio de criptomoedas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full bg-[#111111]">
      <body className={`${inter.className} h-full bg-[#111111] text-gray-100`}>
        <NextAuthProvider>
          <div className="min-h-full">
            <nav className="bg-[#161616] border-b border-[#222222]">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between">
                  <Link href="/portfolios" className="flex items-center">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={32}
                      height={32}
                      className="h-8 w-auto"
                    />
                  </Link>
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-1">
                      <Link
                        href="/portfolios"
                        className="text-gray-400 hover:text-blue-400 rounded-md px-3 py-2 text-sm font-medium inline-flex items-center"
                      >
                        <Wallet className="w-4 h-4 mr-2" />
                        Portfolios
                      </Link>
                      <Link
                        href="/market"
                        className="text-gray-400 hover:text-blue-400 rounded-md px-3 py-2 text-sm font-medium inline-flex items-center"
                      >
                        <LineChart className="w-4 h-4 mr-2" />
                        Mercado
                      </Link>
                    </div>
                    <AuthStatus />
                  </div>
                </div>
              </div>
            </nav>

            <main className="bg-[#111111]">
              <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  )
}
