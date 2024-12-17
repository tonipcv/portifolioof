import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import '@/app/globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navbar } from '@/components/Navbar'
import { SessionProvider } from '@/components/providers/session-provider'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CRYPH - Gerencie seu Portfolio de Criptomoedas',
  description: 'CRYPH é a plataforma definitiva para gerenciar seus investimentos em criptomoedas.',
  keywords: 'cryph, cripto, criptomoedas, portfolio, investimentos, bitcoin, ethereum, trading',
  authors: [{ name: 'CRYPH' }],
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/icon.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: '/apple-icon.png',
        type: 'image/png',
        sizes: '180x180',
      },
    ],
    apple: [
      {
        url: '/apple-icon.png',
        sizes: '180x180',
      },
    ],
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="pt-BR" suppressHydrationWarning className="dark">
      <body className={cn(
        inter.className,
        "min-h-screen bg-[#121214]"
      )}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="crypto-theme"
          >
            <div className="min-h-screen bg-[#121214] flex flex-col">
              <Navbar session={session} />
              <main className="flex-1 md:pl-64 pt-[72px] md:pt-0">
                {children}
              </main>
              <div className="md:pl-64">
                <Footer />
              </div>
              <Toaster />
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
