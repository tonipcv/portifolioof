'use client'

import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'

export default function OnboardWelcomePage() {
  const router = useRouter()

  return (
    <div className="fixed inset-0 flex flex-col bg-black font-['Helvetica_Neue']">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl p-8 sm:p-10 bg-gray-950/50 rounded-xl backdrop-blur-sm border border-gray-800">
          <Logo />
          
          <div className="mt-12 text-center space-y-6">
            <h1 className="text-3xl font-light text-teal-400">
              Seja bem-vindo ao Cryph
            </h1>
            
            <p className="text-gray-400 text-lg leading-relaxed">
              Estamos prontos para oferecer a melhor experiência para você. Somos uma empresa de Research em Criptomoedas e possuímos a primeira inteligência artificial generativa desse mercado.
            </p>

            <p className="text-gray-500">
              Para nos conhecermos melhor clique em continuar e preencha esse rápido formulário:
            </p>

            <div className="pt-6">
              <button
                onClick={() => router.push('/onboard/questions')}
                className="px-8 py-4 border border-teal-400 rounded-lg text-sm font-semibold text-teal-400 bg-teal-400/10 hover:bg-teal-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors tracking-wide"
              >
                CONTINUAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 