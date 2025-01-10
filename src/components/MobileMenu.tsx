'use client'

import { Menu, Transition } from '@headlessui/react'
import { Menu as MenuIcon, LayoutDashboard, LineChart, BookOpen, MessageSquare, Lock, LogOut } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Session } from 'next-auth'
import { Fragment } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from 'next-auth/react'

interface MobileMenuProps {
  session: Session & {
    user?: {
      plan?: string
    }
  }
  isPremium?: boolean
}

export function MobileMenu({ session, isPremium }: MobileMenuProps) {
  const menuItems = [
    {
      name: 'Portfólio',
      href: '/portfolios',
      icon: LayoutDashboard,
      premium: false,
    },
    {
      name: 'Ativos Recomendados',
      href: '/ativos-recomendados',
      icon: LineChart,
      premium: false,
    },
    {
      name: 'Academy',
      href: "/cursos",
      icon: BookOpen,
      premium: false,
    },
    {
      name: 'AI Assistant',
      href: isPremium ? '/chat' : '/blocked',
      icon: MessageSquare,
      premium: true
    }
  ]

  return (
    <>
      <div className="h-[72px] md:hidden" />
      <div className="flex items-center justify-between w-full px-6 py-4 bg-[#121214] fixed top-0 left-0 right-0 border-b border-white/10 md:hidden z-50">
        <Menu as="div" className="relative z-50">
          {({ open }) => (
            <>
              <Menu.Button className="p-2 -ml-2 text-gray-300 hover:text-white focus:outline-none">
                <MenuIcon className={`h-6 w-6 transition-transform duration-200 ${open ? 'transform rotate-180' : ''}`} />
              </Menu.Button>
              
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-lg bg-[#222222] py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-700">
                  {menuItems.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <Link
                          href={item.href}
                          className={`${
                            active ? 'bg-[#333333]' : ''
                          } group flex items-center px-4 py-3 text-sm ${
                            (isPremium || !item.premium) ? 'text-white' : 'text-gray-400'
                          } hover:text-white transition-colors`}
                        >
                          <item.icon className={`mr-3 h-5 w-5 ${
                            (isPremium || !item.premium) ? 'text-white' : 'text-gray-400'
                          } group-hover:text-white transition-colors`} />
                          <span>{item.name}</span>
                          {item.premium && !isPremium && (
                            <Lock className="h-4 w-4 ml-2 text-gray-500" />
                          )}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                  <div className="pt-2">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={`${
                            active ? 'bg-[#333333]' : ''
                          } group flex items-center px-4 py-3 text-sm text-white hover:text-white transition-colors`}
                        >
                          <Avatar className="h-8 w-8 ring-2 ring-white/10 mr-3">
                            <AvatarImage src={session?.user?.image || ''} />
                            <AvatarFallback className="bg-zinc-800 text-white">
                              {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span>{session?.user?.name || 'Usuário'}</span>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className={`${
                            active ? 'bg-[#333333]' : ''
                          } group flex items-center px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors w-full`}
                        >
                          <LogOut className="h-5 w-5 mr-3" />
                          <span>Sair</span>
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>

        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
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
    </>
  )
} 