'use client'

import { usePathname } from 'next/navigation'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  
  const isAuthPage = pathname?.includes('login') || 
                    pathname?.includes('register') || 
                    pathname?.includes('reset-password')

  return (
    <main className={`min-h-screen ${!isAuthPage ? 'md:pl-64' : ''}`}>
      <div className={`mx-auto ${isAuthPage ? 'max-w-md' : 'max-w-7xl'} px-4 py-8`}>
        {children}
      </div>
    </main>
  )
} 