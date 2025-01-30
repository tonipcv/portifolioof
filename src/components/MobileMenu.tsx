'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Session } from 'next-auth'
import { 
  LayoutDashboard, 
  TrendingUp, 
  Bitcoin, 
  GraduationCap,
  Newspaper, 
  MessageSquare, 
  Lock 
} from 'lucide-react'
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
      icon: TrendingUp,
      premium: false,
    },
    {
      name: 'Ativos',
      href: '/ativos-recomendados',
      icon: Bitcoin,
      premium: false,
    },
    {
      name: 'Cursos',
      href: userIsPremium ? '/courses' : '/pricing',
      icon: GraduationCap,
      premium: true,
    },
    {
      name: 'Relatórios',
      href: userIsPremium ? '/news' : '/pricing',
      icon: Newspaper,
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
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#161616] border-b border-[#222222] z-50">
        <div className="flex justify-between items-center h-14 px-4">
          <Link href="/portfolios">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={24}
              className="object-contain brightness-0 invert"
              priority
            />
          </Link>
          
          <Link href="/profile">
            <Avatar className="h-8 w-8 ring-2 ring-white/10">
              <AvatarImage src={session?.user?.image || ''} />
              <AvatarFallback className="bg-zinc-800 text-white text-xs">
                {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
      <div className="h-14 md:hidden" />

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#161616] border-t border-[#222222] z-50">
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const finalHref = item.premium && !userIsPremium ? '/pricing' : item.href
            
            return (
              <Link
                key={item.name}
                href={finalHref}
                className={`flex flex-col items-center justify-center w-full h-full ${
                  isActive ? 'text-white' : 'text-zinc-500'
                }`}
              >
                <div className="relative">
                  <item.icon className={`h-5 w-5 ${isActive ? 'stroke-white' : 'stroke-current'}`} />
                  {item.premium && !userIsPremium && (
                    <Lock className="h-2.5 w-2.5 absolute -top-1 -right-1 text-zinc-500" />
                  )}
                </div>
                <span className="text-[10px] mt-1 font-light tracking-wide">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
} 