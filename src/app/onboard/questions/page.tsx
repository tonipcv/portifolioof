'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'

type Question = {
  id: string
  title: string
  options: string[]
}

const questions: Question[] = [
  {
    id: 'level',
    title: 'Qual seu nível em Criptomoeda?',
    options: ['Começando do zero', 'Iniciante', 'Intermediário', 'Avançado']
  },
  {
    id: 'exchange',
    title: 'Qual corretora você usa?',
    options: ['Binance', 'Bybit', 'Coinbase', 'Outra']
  },
  {
    id: 'traditional_investment',
    title: 'Qual seu patrimônio investido no mercado tradicional?',
    options: [
      'Até 5 mil',
      'De 5 mil a 20 mil',
      'De 20 mil a 100 mil',
      'de 100 mil a 1 milhão',
      'Acima de 1 milhão'
    ]
  },
  {
    id: 'crypto_investment',
    title: 'Qual é a parte do seu patrimônio investido em criptomoedas?',
    options: [
      'Até 5 mil',
      'De 5 mil a 20 mil',
      'De 20 mil a 100 mil',
      'de 100 mil a 1 milhão',
      'Acima de 1 milhão'
    ]
  },
  {
    id: 'discovery',
    title: 'Como nos conheceu?',
    options: ['Instagram', 'Influenciador', 'Youtube', 'Indicação de amigo']
  }
]

export default function OnboardQuestionsPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({
    level: '',
    exchange: '',
    traditional_investment: '',
    crypto_investment: '',
    discovery: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleOptionSelect = (option: string) => {
    const field = questions[currentQuestion].id
    setAnswers(prev => ({
      ...prev,
      [field]: option
    }))
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answers)
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar respostas')
      }

      router.push('/pricing')
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isLastQuestion = currentQuestion === questions.length - 1
  const hasAnswer = answers[questions[currentQuestion].id as keyof typeof answers] !== ''

  return (
    <div className="fixed inset-0 flex flex-col bg-black">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white">
              {questions[currentQuestion].title}
            </h2>
          </div>

          <div className="mt-8 space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-4 text-left rounded-lg border ${
                  answers[questions[currentQuestion].id as keyof typeof answers] === option
                    ? 'border-white text-white'
                    : 'border-white/20 text-white/60 hover:border-white/40'
                } transition-colors`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                className="px-6 py-2 text-sm text-white/60 hover:text-white"
              >
                Voltar
              </button>
            )}
            
            {!isLastQuestion ? (
              <button
                onClick={() => hasAnswer && setCurrentQuestion(prev => prev + 1)}
                disabled={!hasAnswer}
                className={`ml-auto px-6 py-2 rounded-md ${
                  hasAnswer
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'bg-white/20 text-white/60 cursor-not-allowed'
                }`}
              >
                Próxima
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!hasAnswer || isLoading}
                className={`ml-auto px-6 py-2 rounded-md ${
                  hasAnswer && !isLoading
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'bg-white/20 text-white/60 cursor-not-allowed'
                }`}
              >
                {isLoading ? 'Enviando...' : 'Concluir'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 