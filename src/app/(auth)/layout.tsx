import { Providers } from '@/components/Providers'
import '../globals.css'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-[#121214]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 