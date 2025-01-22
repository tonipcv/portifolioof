'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'

export default function BlockedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-red-500" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Conteúdo Exclusivo
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Esta área é exclusiva para membros premium. Faça upgrade agora para ter acesso a todos os recursos.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <div className="bg-[#222222] rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-medium text-white mb-2">
              Benefícios Premium
            </h3>
            <ul className="space-y-2 text-sm text-gray-400 text-left">
              <li>✓ Acesso a análises técnicas detalhadas</li>
              <li>✓ Recomendações de ativos em tempo real</li>
              <li>✓ Assistente AI especializado em criptomoedas</li>
              <li>✓ Portfólios ilimitados</li>
              <li>✓ Cursos exclusivos</li>
            </ul>
          </div>
          <Link
            href="/pricing"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Fazer Upgrade Agora
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-center px-4 py-2 border border-white/10 text-sm font-medium rounded-md text-white bg-transparent hover:bg-white/5"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  )
} 