'use client'

import { Menu, Transition } from '@headlessui/react'
import { Menu as MenuIcon, LayoutDashboard, LineChart, BookOpen, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Session } from 'next-auth'
import { Fragment } from 'react'

interface MobileMenuProps {
  session: Session
  isPremium?: boolean
}

export function MobileMenu({ session, isPremium }: MobileMenuProps) {
  const menuItems = [
    {
      name: 'Portfólio',
      href: '/portfolios',
      icon: LayoutDashboard,
    },
    {
      name: 'Ativos Recomendados',
      href: '/ativos-recomendados',
      icon: LineChart,
    },
    {
      name: 'Academy',
      href: isPremium ? "/cursos" : "/pricing",
      icon: BookOpen,
    },
    {
      name: 'Chat AI',
      href: '/gpt',
      icon: MessageSquare,
      badge: 'Novo'
    },
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
                          } group flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white transition-colors`}
                        >
                          <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="ml-auto px-1.5 py-0.5 text-xs bg-green-600 text-white rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
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