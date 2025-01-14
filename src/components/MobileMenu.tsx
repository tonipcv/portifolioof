'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Session } from 'next-auth'
import { LayoutDashboard, LineChart, BookOpen, MessageSquare, Lock } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MobileMenuProps {
  session: Session & {
    user?: {
      subscriptionStatus?: string
    }
  }
  isPremium?: boolean
}

export function MobileMenu({ session, isPremium }: MobileMenuProps) {
  const pathname = usePathname()
  // Verifica tanto a prop quanto o status da sessão
  const userIsPremium = isPremium || session?.user?.subscriptionStatus === 'premium'

  const menuItems = [
    {
      name: 'Portfólio',
      href: '/portfolios',
      icon: LayoutDashboard,
      premium: false,
    },
    {
      name: 'Análises',
      href: '/analises',
      icon: LineChart,
      premium: false,
    },
    {
      name: 'Ativos',
      href: '/ativos-recomendados',
      icon: LineChart,
      premium: false,
    },
    {
      name: 'Academy',
      href: userIsPremium ? "/cursos" : "/pricing",
      icon: BookOpen,
      premium: true,
    },
    {
      name: 'AI',
      href: userIsPremium ? '/gpt' : '/pricing',
      icon: MessageSquare,
      premium: true
    }
  ]

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 bg-black border-b border-[#222222] z-50">
        <div className="flex justify-center items-center h-14">
          <Link href="/portfolios">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={32}
              className="object-contain brightness-0 invert"
              priority
            />
          </Link>
        </div>
      </div>
      <div className="h-14 md:hidden" />

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-[#222222] z-50">
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const finalHref = item.premium && !userIsPremium ? '/pricing' : item.href
            
            return (
              <Link
                key={item.name}
                href={finalHref}
                className={`flex flex-col items-center justify-center w-full h-full ${
                  isActive ? 'text-white' : 'text-zinc-600'
                }`}
              >
                <div className="relative">
                  <item.icon className={`h-5 w-5 ${isActive ? 'stroke-white' : ''}`} />
                  {item.premium && !userIsPremium && (
                    <Lock className="h-3 w-3 absolute -top-1 -right-1 text-zinc-600" />
                  )}
                </div>
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            )
          })}
          <Link
            href="/profile"
            className={`flex flex-col items-center justify-center w-full h-full ${
              pathname === '/profile' ? 'text-white' : 'text-zinc-600'
            }`}
          >
            <Avatar className="h-6 w-6 ring-2 ring-white/10">
              <AvatarImage src={session?.user?.image || ''} />
              <AvatarFallback className="bg-zinc-800 text-white text-xs">
                {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs mt-1">Perfil</span>
          </Link>
        </div>
      </div>
    </>
  )
} 