'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'

type Step = 'register' | 'verify' | 'email_pending'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('register')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    password: ''
  })
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setStep('verify')
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Erro ao cadastrar usuário')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, whatsapp: formData.whatsapp })
      })

      const data = await response.json()

      if (data.success) {
        setStep('email_pending')
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Erro ao verificar código')
    } finally {
      setLoading(false)
    }
  }

  const labelClasses = "block text-sm font-medium text-gray-400"
  const inputClasses = "mt-2 block w-full px-5 py-4 bg-black/20 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-colors text-white placeholder-gray-600"
  const buttonClasses = "w-full px-5 py-4 border border-teal-400 rounded-lg text-sm font-semibold text-teal-400 bg-teal-400/10 hover:bg-teal-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"

  const renderRegisterForm = () => (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-normal text-teal-400">
          Crie sua conta
        </h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className={labelClasses}>Nome</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: João da Silva"
            className={inputClasses}
            required
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Ex: joao@email.com"
            className={inputClasses}
            required
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>WhatsApp</label>
          <input
            type="text"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            placeholder="+5511999999999"
            className={inputClasses}
            required
            autoComplete="off"
            spellCheck="false"
          />
          <p className="mt-2 text-xs text-gray-600">
            Digite o número com código do país (+55) e DDD
          </p>
        </div>

        <div className="space-y-2">
          <label className={labelClasses}>Senha</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Mínimo 6 caracteres"
            className={inputClasses}
            required
            autoComplete="new-password"
          />
          <p className="mt-2 text-xs text-gray-600">
            Use letras, números e caracteres especiais
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-900/30 rounded-lg px-5 py-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={buttonClasses}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Cadastrando...</span>
          </div>
        ) : (
          "Cadastrar"
        )}
      </button>
    </form>
  )

  const renderVerifyForm = () => (
    <form onSubmit={handleVerifyCode} className="space-y-8" autoComplete="off">
      <div className="text-center">
        <h1 className="text-2xl font-normal text-teal-400">
          Confirme seu número
        </h1>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="000000"
          maxLength={6}
          className={`${inputClasses} text-center text-3xl tracking-[0.75em] h-20`}
          required
          autoComplete="off"
          spellCheck="false"
        />
        <p className="text-sm text-gray-600 text-center">
          Digite o código de 6 dígitos enviado para seu WhatsApp
        </p>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-900/30 rounded-lg px-5 py-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={buttonClasses}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Verificando...</span>
          </div>
        ) : (
          "Verificar código"
        )}
      </button>

      <p className="text-center text-sm text-gray-600">
        Não recebeu o código?{" "}
        <button
          type="button"
          onClick={() => setStep('register')}
          className="text-teal-400 hover:text-teal-300 font-medium focus:outline-none"
        >
          Tentar novamente
        </button>
      </p>
    </form>
  )

  const renderEmailPendingScreen = () => (
    <div className="text-center space-y-8">
      <div className="flex justify-center">
        <div className="rounded-full bg-teal-400/10 p-4">
          <svg 
            className="w-16 h-16 text-teal-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-normal text-teal-400">
          Confirme seu email
        </h2>
        <p className="text-gray-400">
          Enviamos um link de confirmação para {formData.email}
        </p>
        <p className="text-gray-600 text-sm">
          Por favor, verifique sua caixa de entrada e clique no link para confirmar seu email.
        </p>
      </div>

      <button
        onClick={() => router.push('/login')}
        className="inline-flex items-center px-5 py-3 border border-teal-400 text-sm font-medium rounded-lg text-teal-400 hover:bg-teal-400/10 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors"
      >
        <svg 
          className="mr-2 h-4 w-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Ir para login
      </button>
    </div>
  )

  return (
    <div className="fixed inset-0 flex flex-col bg-black font-['Helvetica_Neue']">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 sm:p-10 bg-gray-950/50 rounded-xl backdrop-blur-sm border border-gray-800">
          <div className="text-center">
            <Logo />
          </div>

          <div className="mt-8">
            {step === "register" ? renderRegisterForm() :
             step === "verify" ? renderVerifyForm() :
             renderEmailPendingScreen()}
          </div>
        </div>
      </div>
    </div>
  )
} 