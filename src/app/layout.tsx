import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import './globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navbar } from '@/components/Navbar'
import { SessionProvider } from '@/components/providers/session-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Crypto Portfolio',
  description: 'Gerencie seu portfolio de criptomoedas',
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
            <div className="min-h-screen bg-[#121214]">
              <Navbar session={session} />
              <main className="md:pl-64 min-h-screen bg-[#121214]">
                {children}
              </main>
              <Toaster />
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
