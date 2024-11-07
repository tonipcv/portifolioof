'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="text-gray-400">Carregando...</div>
  }

  if (status === 'authenticated') {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">
          {session.user?.email}
        </span>
        <button
          onClick={() => signOut()}
          className="text-sm text-red-400 hover:text-red-300"
        >
          Sair
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-4">
      <Link
        href="/login"
        className="text-sm text-blue-400 hover:text-blue-300"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="text-sm text-green-400 hover:text-green-300"
      >
        Registrar
      </Link>
    </div>
  )
} 