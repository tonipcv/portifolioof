import { Inter } from 'next/font/google'
import { NextAuthProvider } from '@/providers/NextAuthProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full bg-[#111111]">
      <body className={`${inter.className} h-full bg-[#111111] text-gray-100`}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
} 