'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Logo } from '@/components/Logo'

export default function ConfirmEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch('/api/auth/confirm-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        })

        const data = await response.json()

        if (data.success) {
          setStatus('success')
          setMessage('Email confirmado com sucesso!')
          // Redirecionar para onboarding após 1 segundo
          setTimeout(() => router.push('/onboard'), 1000)
        } else {
          setStatus('error')
          setMessage(data.message || 'Erro ao confirmar email')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Erro ao confirmar email')
      }
    }

    if (code) {
      confirmEmail()
    } else {
      setStatus('error')
      setMessage('Código de verificação inválido')
    }
  }, [code, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-['Helvetica_Neue'] p-4">
      <div className="w-full max-w-md space-y-12 p-8 sm:p-10 bg-gray-950/50 rounded-xl backdrop-blur-sm border border-gray-800">
        <Logo />

        <div className="text-center space-y-6">
          {status === 'loading' ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
            </div>
          ) : status === 'success' ? (
            <>
              <div className="flex justify-center">
                <div className="rounded-full bg-teal-400/10 p-3">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-white">
                {message}
              </h2>
              <p className="text-gray-400">
                Redirecionando para o onboarding...
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <div className="rounded-full bg-red-400/10 p-3">
                  <svg 
                    className="w-16 h-16 text-red-400"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-white">
                {message}
              </h2>
              <button
                onClick={() => router.push('/login')}
                className="inline-flex items-center px-4 py-2 border border-teal-400 text-sm font-medium rounded-lg text-teal-400 hover:bg-teal-400/10 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors"
              >
                Ir para login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 