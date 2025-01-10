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
    <div className="min-h-screen relative">
      {/* Conteúdo borrado de fundo */}
      <div className="absolute inset-0 z-0">
        <div className="container mx-auto px-4 py-8 blur-md opacity-40">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">Chat com Alex 💬</h1>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg border border-white/10 p-6">
            <div className="space-y-4">
              {/* Mensagens simuladas borradas */}
              <div className="flex justify-start mb-4">
                <div className="w-8 h-8 rounded-full bg-green-600 mr-2" />
                <div className="max-w-[80%] bg-[#1a1a1a] border border-white/10 rounded-lg p-4">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-700 rounded w-1/2" />
                </div>
              </div>
              <div className="flex justify-end mb-4">
                <div className="max-w-[80%] bg-green-900/20 border border-green-100/20 rounded-lg p-4">
                  <div className="h-4 bg-gray-700 rounded w-2/3" />
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 ml-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de bloqueio */}
      <div className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-[#1a1a1a] p-8 rounded-lg border border-white/10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-green-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">
            Conteúdo Premium
          </h2>
          
          <p className="text-gray-400 mb-6">
            Este recurso está disponível apenas para membros premium. Faça upgrade agora e tenha acesso a todas as funcionalidades.
          </p>
          
          <div className="space-y-4">
            <a
              href="https://app.cryph.ai/pricing"
              className="block w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-semibold"
            >
              Fazer Upgrade para Premium
            </a>
            
            <Link
              href="/"
              className="block text-sm text-gray-400 hover:text-white transition-colors"
            >
              Voltar para Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 