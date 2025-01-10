'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Bot, LineChart, Wallet, Target, DollarSign, UserCircle2, Bitcoin, Check, X } from 'lucide-react'
import Image from 'next/image'

type Question = {
  id: number
  title: string
  icon: any
  options: {
    id: string
    label: string
  }[]
}

export default function OnboardPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPlans, setShowPlans] = useState(false)
  const [answers, setAnswers] = useState({
    objective: '',
    investmentAmount: '',
    profile: '',
    experience: ''
  })

  const questions: Question[] = [
    {
      id: 1,
      title: "Qual é o seu objetivo principal?",
      icon: Target,
      options: [
        { id: 'longterm', label: 'Construir uma carteira de longo prazo' },
        { id: 'track', label: 'Acompanhar o desempenho dos ativos' },
        { id: 'insights', label: 'Receber insights do mercado em tempo real' }
      ]
    },
    {
      id: 2,
      title: "Quanto você planeja investir?",
      icon: DollarSign,
      options: [
        { id: 'under1k', label: 'Até $1.000' },
        { id: 'under10k', label: '$1.000 - $10.000' },
        { id: 'over10k', label: 'Mais de $10.000' }
      ]
    },
    {
      id: 3,
      title: "Qual é o seu perfil de investidor?",
      icon: UserCircle2,
      options: [
        { id: 'conservative', label: 'Conservador' },
        { id: 'moderate', label: 'Moderado' },
        { id: 'aggressive', label: 'Agressivo' }
      ]
    },
    {
      id: 4,
      title: "Qual é a sua experiência com criptomoedas?",
      icon: Bitcoin,
      options: [
        { id: 'beginner', label: 'Iniciante' },
        { id: 'intermediate', label: 'Intermediário' },
        { id: 'advanced', label: 'Avançado' }
      ]
    }
  ]

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowPlans(true)
    }
  }

  if (showPlans) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div className="bg-[#121214] rounded-lg max-w-4xl w-full p-8 relative">
          {/* Botão fechar */}
          <button 
            onClick={() => router.push('/portfolios')}
            className="absolute top-4 right-4 text-white/40 hover:text-white/60"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Título */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4">Escolha seu plano</h2>
            <p className="text-white/60 font-light">
              Selecione o plano que melhor atende suas necessidades
            </p>
          </div>

          {/* Grid de planos */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Plano Basic */}
            <div className="border border-white/10 rounded-lg p-6 space-y-6">
              <div className="text-xl font-light mb-2">Basic</div>
              <p className="text-white/60">Comece sua jornada</p>
              
              <ul className="space-y-4">
                <li className="flex items-center text-white/80">
                  <Check className="w-5 h-5 mr-3 text-red-500" />
                  <span>Acesso limitado a insights gerais</span>
                </li>
                <li className="flex items-center text-white/80">
                  <Check className="w-5 h-5 mr-3 text-red-500" />
                  <span>Relatórios básicos de desempenho</span>
                </li>
              </ul>

              <button
                onClick={() => router.push('/portfolios')}
                className="w-full py-3 border border-white/10 rounded-lg hover:bg-white/5 
                  transition-colors font-light mt-8"
              >
                Começar Grátis
              </button>
            </div>

            {/* Plano Pro */}
            <div className="border border-red-500 rounded-lg p-6 space-y-6 relative">
              <div className="absolute -top-3 right-4 bg-red-500 text-sm py-1 px-3 rounded-full">
                Recomendado
              </div>
              
              <div className="text-xl font-light mb-2">Pro</div>
              <p className="text-white/60">Acesso completo</p>
              
              <ul className="space-y-4">
                <li className="flex items-center text-white/80">
                  <Check className="w-5 h-5 mr-3 text-red-500" />
                  <span>Acesso total à inteligência artificial</span>
                </li>
                <li className="flex items-center text-white/80">
                  <Check className="w-5 h-5 mr-3 text-red-500" />
                  <span>Relatórios detalhados e exclusivos</span>
                </li>
                <li className="flex items-center text-white/80">
                  <Check className="w-5 h-5 mr-3 text-red-500" />
                  <span>Alertas personalizados</span>
                </li>
              </ul>

              <button
                onClick={() => router.push('https://app.cryph.ai/pricing')}
                className="w-full py-3 bg-red-500 hover:bg-red-600 rounded-lg 
                  transition-colors font-light mt-8"
              >
                Upgrade para Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentStep - 1]

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-4 bg-[#121214]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-16">
          <Image
            src="/logo.png"
            alt="CRYPH"
            width={140}
            height={45}
            className="object-contain brightness-0 invert"
            priority
          />
        </div>

        {/* Content */}
        <div className="w-full">
          {/* Progress bar */}
          <div className="h-0.5 bg-white/10 rounded-full mb-16">
            <div 
              className="h-0.5 bg-red-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / questions.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="space-y-12">
            <div className="text-center space-y-6">
              <currentQuestion.icon className="w-12 h-12 mx-auto text-red-500/40" />
              <h2 className="text-2xl font-light tracking-wide">
                {currentQuestion.title}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setAnswers({ ...answers, [currentQuestion.id]: option.id })
                    handleNext()
                  }}
                  className="w-full p-4 rounded-lg border border-white/10 hover:border-red-500/20 hover:bg-red-500/5 
                    transition-all duration-200 text-center font-light tracking-wide"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Skip option */}
          <button
            onClick={handleNext}
            className="mt-12 text-sm text-white/40 hover:text-red-500/60 transition-colors mx-auto block font-light"
          >
            Pular esta etapa
          </button>
        </div>
      </div>
    </div>
  )
} 