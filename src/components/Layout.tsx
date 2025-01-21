'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import {
  XMarkIcon,
  Bars3Icon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Portfólios', href: '/portfolios', icon: FolderIcon },
  { name: 'Mercado', href: '/market', icon: ChartBarIcon },
  { name: 'Transações', href: '/transactions', icon: CurrencyDollarIcon },
  { name: 'Configurações', href: '/settings', icon: Cog6ToothIcon },
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const Logo = () => (
    <div className="flex items-center gap-2">
      <div className="bg-blue-500 p-1.5 rounded">
        <span className="text-lg font-bold text-white">K17</span>
      </div>
      <span className="text-lg font-semibold text-white">Assets</span>
    </div>
  )

  return (
    <div>
      {/* Mobile sidebar */}
      <Dialog
        as="div"
        className="relative z-50 lg:hidden"
        open={sidebarOpen}
        onClose={setSidebarOpen}
      >
        <div className="fixed inset-0 bg-gray-900/80" />

        <div className="fixed inset-0 flex">
          <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-800 px-6 pb-4 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <Logo />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={`
                              group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6
                              ${pathname === item.href
                                ? 'bg-gray-700 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                              }
                            `}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-800 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Logo />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6
                          ${pathname === item.href
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                          }
                        `}
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-700 bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Mobile logo */}
          <div className="flex flex-1 items-center gap-x-4 lg:gap-x-6">
            <div className="lg:hidden">
              <Logo />
            </div>
          </div>
        </div>

        <main className="min-h-screen bg-gray-900 py-4 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
} 