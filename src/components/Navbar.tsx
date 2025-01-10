'use client'

import { Session } from 'next-auth'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, BookOpen, LineChart, Menu, LogOut, User, MessageSquare, Lock } from 'lucide-react'
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
  const { theme } = useTheme()
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
      premium: false,
    },
    {
      label: 'Análises',
      icon: LineChart,
      href: '/analises',
      premium: false,
    },
    {
      label: 'Ativos Recomendados',
      icon: LineChart,
      href: '/ativos-recomendados',
      premium: false,
    },
    {
      label: 'Academy',
      icon: BookOpen,
      href: isPremium ? "/cursos" : "/pricing",
      premium: true,
    },
    {
      label: 'AI Assistant',
      icon: MessageSquare,
      href: isPremium ? '/gpt' : '/pricing',
      premium: true
    }
  ]

  return (
    <>
      {/* Mobile Menu */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        {session && <MobileMenu session={session} isPremium={isPremium} />}
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col h-full w-64 fixed left-0 top-0 bg-[#121214] text-white border-r border-white/10">
        <div className="flex-1">
          <div className="h-24 flex items-center px-6 mt-4">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={40}
                className="object-contain brightness-0 invert"
                priority
              />
            </Link>
          </div>
          <div className="space-y-1 px-3 mt-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-white/5 rounded-lg transition ${
                  isPremium || !route.premium ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={`h-5 w-5 mr-3 ${
                    isPremium || !route.premium ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  } transition-colors`} />
                  <span>{route.label}</span>
                  {route.premium && !isPremium && (
                    <Lock className="h-4 w-4 ml-2 text-gray-500" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="p-3 flex items-center justify-between">
            <Link 
              href="/profile"
              className="flex items-center space-x-3 hover:bg-white/5 rounded-lg p-2 transition-colors w-full"
            >
              <Avatar className="h-8 w-8 ring-2 ring-white/10">
                <AvatarImage src={session?.user?.image || ''} />
                <AvatarFallback className="bg-zinc-800 text-white">
                  {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-300">
                {session?.user?.name || 'Usuário'}
              </span>
            </Link>
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center p-2 text-gray-400 hover:text-gray-200 transition-colors"
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