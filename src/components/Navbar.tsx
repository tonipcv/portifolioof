'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { signOut } from 'next-auth/react'
import { LogOut, User } from 'lucide-react'
import Link from 'next/link'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function Navbar() {
  return (
    <div className="bg-[#161616] border-b border-[#222222]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link
              href="/portfolios"
              className="flex items-center px-2 text-gray-200 hover:text-gray-100"
            >
              <span className="text-xl font-semibold">Crypto Portfolio</span>
            </Link>
          </div>

          <div className="flex items-center">
            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="relative flex rounded-full bg-[#222222] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <span className="sr-only">Abrir menu do usuário</span>
                  <User className="h-5 w-5 text-gray-300" aria-hidden="true" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-[#222222] py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className={classNames(
                          active ? 'bg-[#333333]' : '',
                          'flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:text-white'
                        )}
                      >
                        <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                        Sair
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  )
} 