import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Lock } from 'lucide-react'
import Link from 'next/link'

export default async function BlockedPage() {
  const session = await getServerSession(authOptions)
  
  if (session?.user?.subscriptionStatus === 'premium') {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121214] p-4">
      <div className="bg-[#18181B] p-8 rounded-lg border border-blue-500/20 max-w-md w-full text-center shadow-[0_0_15px_rgba(59,130,246,0.1)]">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-blue-500/30">
          <Lock className="w-8 h-8 text-blue-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">
          Conteúdo Premium
        </h2>
        
        <p className="text-gray-400 mb-8">
          Este recurso está disponível apenas para membros premium.
        </p>
        
        <div className="space-y-4">
          <a
            href="https://app.cryph.ai/pricing"
            className="block w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 font-medium shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
          >
            Fazer Upgrade
          </a>
          
          <Link
            href="/"
            className="block text-sm text-gray-400 hover:text-blue-400 transition-colors"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  )
} 