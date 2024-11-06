import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="pt-BR" className="h-full bg-black">
      <body className={`${inter.className} h-full bg-black text-gray-100`}>
        <nav className="bg-gray-950 border-b border-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/portfolios" className="text-white font-bold hover:text-green-400 transition-colors">
              Crypto Portfolio
            </Link>
            <div className="flex gap-4">
              <Link 
                href="/portfolios" 
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Meus Portfolios
              </Link>
              <Link 
                href="/market" 
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Mercado
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
