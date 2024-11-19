'use client'

import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export function AuthStatus() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="animate-pulse flex items-center gap-2">
        <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
        <div className="h-4 w-24 bg-gray-700 rounded"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
      >
        Fazer Login
      </Link>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
          {session.user?.name?.[0] || session.user?.email?.[0] || '?'}
        </div>
        <span className="font-medium hidden sm:block">
          {session.user?.name || session.user?.email?.split('@')[0]}
        </span>
      </button>

      {isMenuOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 py-1 bg-[#222222] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#333333] transition-colors"
          >
            Perfil
          </Link>
          <Link
            href="/pricing"
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#333333] transition-colors"
          >
            {session.user?.subscriptionStatus === 'premium' ? 'Gerenciar Assinatura' : 'Upgrade para Premium'}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#333333] transition-colors"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  )
} 