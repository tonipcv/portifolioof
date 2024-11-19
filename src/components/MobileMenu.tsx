'use client'

import { Menu } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Session } from 'next-auth'

interface MobileMenuProps {
  session: Session
  isPremium?: boolean
}

export function MobileMenu({ session, isPremium }: MobileMenuProps) {
  return (
    <Menu as="div" className="relative sm:hidden">
      <Menu.Button className="p-2 text-gray-300 hover:text-white">
        <Bars3Icon className="h-6 w-6" />
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-[#222222] py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <Menu.Item>
          {({ active }) => (
            <Link
              href="/portfolios"
              className={`${
                active ? 'bg-[#333333]' : ''
              } block px-4 py-2 text-sm text-gray-300`}
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
              } block px-4 py-2 text-sm text-gray-300`}
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
              } block px-4 py-2 text-sm text-gray-300`}
            >
              Academy
            </Link>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
} 