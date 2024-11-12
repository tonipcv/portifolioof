import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Crypto Portfolio',
  description: 'Gerencie seu portfólio de criptomoedas',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#111111] min-h-screen`}>
        <Providers>
          {session && <Navbar />}
          {children}
        </Providers>
      </body>
    </html>
  )
}
