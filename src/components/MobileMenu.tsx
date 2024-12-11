'use client'

import { Menu } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import { Session } from 'next-auth'

interface MobileMenuProps {
  session: Session
  isPremium?: boolean
}

export function MobileMenu({ session, isPremium }: MobileMenuProps) {
  return (
    <>
      <div className="h-[72px] md:hidden" />
      <div className="flex items-center justify-between w-full px-6 py-4 bg-[#121214] fixed top-0 left-0 right-0 border-b border-white/10 md:hidden z-50">
        <Menu as="div" className="relative z-50">
          <Menu.Button className="p-2 -ml-2 text-gray-300 hover:text-white">
            <Bars3Icon className="h-6 w-6" />
          </Menu.Button>
          <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-[#222222] py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/portfolios"
                  className={`${
                    active ? 'bg-[#333333]' : ''
                  } block px-4 py-2.5 text-sm text-gray-300`}
                >
                  Portfólio
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/ativos-recomendados"
                  className={`${
                    active ? 'bg-[#333333]' : ''
                  } block px-4 py-2.5 text-sm text-gray-300`}
                >
                  Ativos Recomendados
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={isPremium ? "/cursos" : "/pricing"}
                  className={`${
                    active ? 'bg-[#333333]' : ''
                  } block px-4 py-2.5 text-sm text-gray-300`}
                >
                  Academy
                </Link>
              )}
            </Menu.Item>
          </Menu.Items>
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