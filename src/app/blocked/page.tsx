'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Phone } from 'lucide-react'
import Image from 'next/image'

export default function BlockedPage() {
  const router = useRouter()
  const { data: session } = useSession()

  if (!session) {
    router.push('/login')
    return null
  }

  return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center font-helvetica px-4">
      <div className="w-full max-w-md text-center space-y-8">
        <Image
          src="/logo.png" 
          alt="Logo"
          width={120}
          height={36}
          priority
          className="mx-auto brightness-0 invert"
        />

        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-green-100/20 p-8 space-y-6">
          <div className="mx-auto w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center">
            <Phone className="w-8 h-8 text-zinc-400" />
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-light text-zinc-100">
              Verifique seu WhatsApp
            </h1>
            <p className="text-zinc-400 text-sm">
              Para acessar esta área, você precisa verificar seu número de WhatsApp.
              Por favor, complete o processo de verificação.
            </p>
          </div>

          <button
            onClick={() => router.push('/register')}
            className="w-full py-2.5 bg-zinc-800/30 border border-green-100/20 
              text-zinc-100 rounded-lg transition-all duration-300 
              hover:bg-zinc-700/50 hover:border-green-100/40 
              focus:outline-none focus:ring-2 focus:ring-green-100/30
              font-light tracking-wide"
          >
            Verificar WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
} 