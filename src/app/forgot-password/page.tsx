'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        throw new Error('Failed to send recovery email')
      }

      setSuccess(true)
      setEmail('')
    } catch (error) {
      setError('Falha ao enviar email de recuperação. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-4 bg-[#111111]">
      <div className="w-full sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/logo.png" 
            alt="Logo"
            width={140}
            height={37}
            priority
            className="mx-auto"
          />
        </div>

        <div className="bg-[#161616] py-8 px-4 shadow-xl ring-1 ring-gray-900/10 sm:rounded-lg sm:px-10">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white">Recuperar Senha</h2>
            <p className="mt-2 text-sm text-gray-400">
              Digite seu email para receber um link de recuperação de senha
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 bg-[#222222] border border-gray-800 rounded-md py-2 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-900/50 text-red-400 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-900/50 text-green-400 p-3 rounded-md text-sm">
                Email de recuperação enviado! Verifique sua caixa de entrada.
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Enviar Email de Recuperação'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 