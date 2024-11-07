import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
    <html lang="pt-BR" className="h-full bg-[#111111]">
      <body className={`${inter.className} h-full bg-[#111111] text-gray-100`}>
        {children}
      </body>
    </html>
  )
}
