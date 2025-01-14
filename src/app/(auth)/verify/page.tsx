'use client'

import React, { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function VerifyPage({
  searchParams,
}: {
  searchParams: { userId?: string }
}) {
  const router = useRouter()
  const [whatsapp, setWhatsapp] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ whatsapp, userId: searchParams.userId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar código')
      }

      setStep('code')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao enviar código')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, whatsapp, userId: searchParams.userId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Código inválido')
      }

      // Redirecionar para página de sucesso
      router.push('/verify/success')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao verificar código')
    } finally {
      setLoading(false)
    }
  }

  const labelClasses = "block text-sm font-medium text-gray-400"
  const inputClasses = "mt-2 block w-full px-5 py-4 bg-black/20 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-colors text-white placeholder-gray-600"
  const buttonClasses = "w-full px-5 py-4 border border-teal-400 rounded-lg text-sm font-semibold text-teal-400 bg-teal-400/10 hover:bg-teal-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"

  const renderPhoneForm = () => (
    <form onSubmit={handleSendCode} className="space-y-8" autoComplete="off">
      <div className="text-center">
        <h1 className="text-2xl font-normal text-teal-400">
          Verificar WhatsApp
        </h1>
      </div>

      <div className="space-y-2">
        <label className={labelClasses}>WhatsApp</label>
        <input
          type="text"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
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
            <span>Enviando...</span>
          </div>
        ) : (
          "Enviar código"
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
          onClick={() => setStep('phone')}
          className="text-teal-400 hover:text-teal-300 font-medium focus:outline-none"
        >
          Tentar novamente
        </button>
      </p>
    </form>
  )

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center font-helvetica">
      <div className="w-full max-w-sm px-8 py-10 bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-green-100/20">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={36}
            className="mx-auto mb-8 brightness-0 invert"
          />
        </div>

        <div className="mt-8">
          {step === 'phone' ? renderPhoneForm() : renderVerifyForm()}
        </div>
      </div>
    </div>
  )
} 