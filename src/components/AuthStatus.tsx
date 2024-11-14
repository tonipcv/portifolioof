'use client'

import { useSession, signOut } from 'next-auth/react'
import { LogOut, User, Settings } from 'lucide-react'
import Link from 'next/link'

export function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="text-gray-400">Carregando...</div>
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-gray-400" />
        <span className="hidden sm:inline text-sm text-gray-400">
          {session?.user?.name || 'Usuário'}
        </span>
      </div>
      <Link
        href="/settings/password"
        className="text-gray-400 hover:text-blue-400 transition-colors"
        title="Alterar Senha"
      >
        <Settings className="h-5 w-5" />
      </Link>
      <button
        onClick={() => signOut()}
        className="text-gray-400 hover:text-red-400 transition-colors"
        title="Sair"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  )
} 