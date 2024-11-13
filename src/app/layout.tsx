import { Inter } from 'next/font/google'
import './globals.css'
import { AuthStatus } from '@/components/AuthStatus'
import Image from 'next/image'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Kriptwa',
  description: 'Acompanhe seus investimentos em criptomoedas de forma simples e eficiente',
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-[#111111] text-white`}>
        <Providers session={session}>
          <div className="min-h-full">
            <nav className="border-b border-[#222222]">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      <Image
                        src="/logo.png"
                        alt="Logo"
                        width={80}
                        height={24}
                        priority
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <AuthStatus />
                  </div>
                </div>
              </div>
            </nav>

            <main>
              <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
