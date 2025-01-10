import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import '@/app/globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navbar } from '@/components/Navbar'
import { SessionProvider } from '@/components/providers/session-provider'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'CRYPH - Artificial Intelligence for Cryptocurrency',
  description: 'CRYPH é a plataforma definitiva para gerenciar seus investimentos em criptomoedas com inteligência artificial.',
  keywords: 'cryph, cripto, criptomoedas, portfolio, investimentos, bitcoin, ethereum, trading, artificial intelligence, AI',
  authors: [{ name: 'CRYPH' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon.png',
    },
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://cryph.ai',
    title: 'CRYPH - Artificial Intelligence for Cryptocurrency',
    description: 'CRYPH é a plataforma definitiva para gerenciar seus investimentos em criptomoedas com inteligência artificial.',
    siteName: 'CRYPH',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CRYPH - Artificial Intelligence for Cryptocurrency',
    description: 'CRYPH é a plataforma definitiva para gerenciar seus investimentos em criptomoedas com inteligência artificial.',
    creator: '@cryph_ai',
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
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="min-h-screen bg-[#121214]">
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
