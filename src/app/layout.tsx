import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Layout from '@/components/Layout'
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
    <html lang="pt-BR" className="h-full bg-gray-900">
      <body className={`${inter.className} h-full`}>
        <nav className="bg-gray-900 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-white font-bold">
              Crypto Tracker
            </Link>
            <Link 
              href="/portfolios" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Portfolios
            </Link>
          </div>
        </nav>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
