import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navbar } from '@/components/Navbar'
import { SessionProvider } from '@/components/providers/session-provider'
import { MainLayout } from '@/components/MainLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cryph',
  description: 'Plataforma de análise e gestão de portfólio de criptomoedas',
  keywords: ['criptomoedas', 'bitcoin', 'ethereum', 'análise', 'portfólio'],
  openGraph: {
    title: 'Cryph',
    description: 'Plataforma de análise e gestão de portfólio de criptomoedas',
    url: 'https://app.cryph.ai',
    siteName: 'Cryph',
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000')
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#121214]`}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="cryph-theme"
          >
            <Navbar session={session} />
            <MainLayout>
              {children}
            </MainLayout>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
