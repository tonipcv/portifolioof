import Link from 'next/link'
import { Wallet, LineChart } from 'lucide-react'
import Image from 'next/image'
import { NextAuthProvider } from '@/providers/NextAuthProvider'
import { AuthStatus } from '@/components/AuthStatus'
import { MobileMenu } from '@/components/MobileMenu'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NextAuthProvider>
      <div className="min-h-screen bg-[#161616]">
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

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
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

              {/* Mobile menu button */}
              <MobileMenu />
            </div>
          </div>
        </nav>

        <main className="min-h-screen bg-[#161616]">
          {children}
        </main>
      </div>
    </NextAuthProvider>
  )
} 