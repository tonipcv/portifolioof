'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'

type Step = 'register' | 'verify'

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
  const [userId, setUserId] = useState<string | null>(null)

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
        setUserId(data.userId)
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

  const handleResendCode = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp: formData.whatsapp, userId })
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Erro ao reenviar código')
      }
    } catch (error) {
      setError('Erro ao reenviar código')
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
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, 
          whatsapp: formData.whatsapp,
          userId
        })
      })

      const data = await response.json()

      if (data.success) {
        router.push('/verify/success')
      } else {
        setError(data.error || 'Código inválido')
      }
    } catch (error) {
      setError('Erro ao verificar código')
    } finally {
      setLoading(false)
    }
  }

  const labelClasses = "block text-sm font-medium text-gray-400"
  const inputClasses = "mt-1 block w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-transparent transition-colors text-white placeholder-gray-600 text-sm"
  const buttonClasses = "w-full px-4 py-3 border border-white/10 rounded-lg text-sm font-medium text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

  const renderRegisterForm = () => (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center">
        <h1 className="text-xl font-normal text-white">
          Crie sua conta
        </h1>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClasses}>Nome</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClasses}
            required
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <div>
          <label className={labelClasses}>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={inputClasses}
            required
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <div>
          <label className={labelClasses}>WhatsApp</label>
          <input
            type="text"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            className={inputClasses}
            required
            autoComplete="off"
            spellCheck="false"
          />
          <p className="mt-1 text-xs text-gray-600">
            Digite o número com código do país (+55) e DDD
          </p>
        </div>

        <div>
          <label className={labelClasses}>Senha</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={inputClasses}
            required
            autoComplete="new-password"
          />
          <p className="mt-1 text-xs text-gray-600">
            Use letras, números e caracteres especiais
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-900/30 rounded-lg px-4 py-3 text-red-400 text-xs">
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
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    <form onSubmit={handleVerifyCode} className="space-y-5" autoComplete="off">
      <div className="text-center">
        <h1 className="text-xl font-normal text-white">
          Confirme seu número
        </h1>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          className={`${inputClasses} text-center text-xl tracking-[0.5em] h-14`}
          required
          autoComplete="off"
          spellCheck="false"
        />
        <p className="text-xs text-gray-600 text-center">
          Digite o código de 6 dígitos enviado para seu WhatsApp
        </p>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-900/30 rounded-lg px-4 py-3 text-red-400 text-xs">
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
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Verificando...</span>
          </div>
        ) : (
          "Verificar código"
        )}
      </button>

      <p className="text-center text-xs text-gray-600">
        Não recebeu o código?{" "}
        <button
          type="button"
          onClick={handleResendCode}
          className="text-white hover:text-gray-300 font-medium focus:outline-none"
        >
          Tentar novamente
        </button>
      </p>
    </form>
  )

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-helvetica px-4 py-8 pb-20 sm:pb-8">
      <div className="w-full max-w-sm bg-zinc-950/50 backdrop-blur-sm rounded-lg border border-white/5 p-6">
        <div className="text-center mb-8">
          <Logo />
        </div>

        {step === 'register' ? renderRegisterForm() : renderVerifyForm()}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Desenvolvido por XASE
        </p>
      </div>
    </div>
  )
} 