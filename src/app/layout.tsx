import { Inter } from 'next/font/google'
import './globals.css'
import { AuthStatus } from '@/components/AuthStatus'
import Image from 'next/image'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { Providers } from '@/components/Providers'
import Link from 'next/link'
import { Briefcase, GraduationCap } from 'lucide-react'
import { MobileMenu } from '@/components/MobileMenu'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Wallet',
  description: 'Acompanhe seus investimentos em criptomoedas de forma simples e eficiente',
  icons: {
    icon: [
      {
        url: '/favicon.png',
        href: '/favicon.png',
      }
    ],
    shortcut: '/favicon.png',
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
    <html lang="en" className="h-full bg-[#111111]">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              document.documentElement.style.backgroundColor = '#111111';
              document.body.style.backgroundColor = '#111111';
            })();
          `
        }} />
      </head>
      <body className={`${inter.className} h-full bg-[#111111] text-white`}>
        <Providers session={session}>
          <div className="min-h-full bg-[#111111]">
            <nav className="border-b border-[#222222] bg-[#161616]">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                  <div className="flex items-center gap-8">
                    <Link href="/" className="flex flex-shrink-0 items-center">
                      <Image
                        src="/logo.png"
                        alt="Logo"
                        width={80}
                        height={24}
                        priority
                      />
                    </Link>
                    
                    {session && (
                      <div className="hidden sm:flex items-center gap-6">
                        <Link 
                          href="/portfolios"
                          className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#222222] rounded-md transition-colors"
                        >
                          <Briefcase className="w-4 h-4" />
                          <span className="text-sm font-medium">Portfólio</span>
                        </Link>
                        <Link 
                          href="/cursos/4"
                          className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#222222] rounded-md transition-colors"
                        >
                          <GraduationCap className="w-4 h-4" />
                          <span className="text-sm font-medium">Academy</span>
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <AuthStatus />
                    {session && <MobileMenu session={session} />}
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
