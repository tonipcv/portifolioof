'use client'

import { Session } from 'next-auth'
import { ThemeToggle } from './ThemeToggle'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, BookOpen, LineChart, Menu, LogOut, User } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { MobileMenu } from './MobileMenu'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavbarProps {
  session: Session | null
}

export function Navbar({ session }: NavbarProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isPremium = session?.user?.subscriptionStatus === 'premium'
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <nav className="hidden md:flex flex-col h-full w-64 fixed left-0 top-0 bg-[#121214] text-white border-r border-white/10">
        <div className="animate-pulse">
          <div className="h-24 bg-gray-800"></div>
        </div>
      </nav>
    )
  }

  if (pathname?.includes('login') || pathname?.includes('register')) {
    return null
  }

  const routes = [
    {
      label: 'Portfólio',
      icon: LayoutDashboard,
      href: '/portfolios',
    },
    {
      label: 'Ativos Recomendados',
      icon: LineChart,
      href: '/ativos-recomendados',
    },
    {
      label: 'Academy',
      icon: BookOpen,
      href: isPremium ? '/cursos' : '/pricing',
    }
  ]

  const LogoComponent = () => {    
    return (
      <Image
        src="/logo.png"
        alt="Logo"
        width={120}
        height={40}
        className={cn(
          "object-contain",
          theme === 'dark' ? 'brightness-0 invert' : 'brightness-0'
        )}
        priority
      />
    )
  }

  return (
    <>
      {/* Mobile Menu */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        {session && <MobileMenu session={session} isPremium={isPremium} />}
      </div>

      {/* Desktop Sidebar */}
      <nav className={cn(
        "hidden md:flex flex-col h-full w-64 fixed left-0 top-0 border-r transition-colors",
        mounted && theme === 'dark' 
          ? "bg-[#121214] text-white border-white/10" 
          : "bg-white text-zinc-900 border-zinc-200"
      )}>
        <div className="flex-1">
          <div className="h-24 flex items-center px-6 mt-4">
            <Link href="/">
              <LogoComponent />
            </Link>
          </div>
          <div className="space-y-1 px-3 mt-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg transition",
                  "text-zinc-500 dark:text-zinc-400"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className="h-5 w-5 mr-3 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                  {route.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="border-t border-zinc-200 dark:border-white/10">
          <Link
            href="/profile"
            className={cn(
              "flex items-center p-3 text-sm font-medium cursor-pointer hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition",
              "text-zinc-500 dark:text-white"
            )}
          >
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8 ring-2 ring-white/20">
                <AvatarImage src={session?.user?.image || ''} />
                <AvatarFallback className="bg-zinc-800 text-white">
                  {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-white">
                {session?.user?.name || 'Usuário'}
              </span>
            </div>
          </Link>
          <div className="p-3 flex items-center justify-between border-t border-zinc-200 dark:border-white/10">
            <ThemeToggle />
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center p-2 text-zinc-500 dark:text-white hover:text-zinc-900 dark:hover:text-white/80 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  )
} 