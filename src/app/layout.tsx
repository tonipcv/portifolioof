import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/Navbar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import './globals.css'
import { cn } from '@/lib/utils'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  // Verifica se a rota atual está no grupo (auth)
  const isAuthRoute = children?.toString().includes('(auth)')

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-[#121214]">
        <Providers>
          {!isAuthRoute && <Navbar session={session} />}
          <main className={cn(
            "min-h-screen",
            !isAuthRoute && "md:pl-64 pt-[72px] md:pt-0"
          )}>
            <div className="h-full">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  )
}
