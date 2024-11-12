import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/providers/Providers'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'K17',
  description: 'Sua carteira de Criptomoedas',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-[#111111]">
      <body className={`${inter.className} min-h-screen bg-[#111111]`}>
        <Providers>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
