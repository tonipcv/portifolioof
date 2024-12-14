'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Mail, Lock, User } from 'lucide-react'
import Image from 'next/image'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password')
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      router.push('/login')
    } catch (error) {
      setError('Falha ao registrar usuário. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center font-helvetica px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Image
            src="/logo.png" 
            alt="Logo"
            width={120}
            height={36}
            priority
            className="mx-auto mb-8 brightness-0 invert"
          />
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-green-100/20 py-8 px-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-light text-zinc-300 mb-1">
                Nome
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full pl-10 bg-zinc-800/30 border border-green-100/20 
                    rounded-lg py-2 text-zinc-100 placeholder-zinc-500 
                    focus:outline-none focus:ring-2 focus:ring-green-100/30 focus:border-green-100/30 
                    transition-all duration-300 font-light text-sm"
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-light text-zinc-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 bg-zinc-800/30 border border-green-100/20 
                    rounded-lg py-2 text-zinc-100 placeholder-zinc-500 
                    focus:outline-none focus:ring-2 focus:ring-green-100/30 focus:border-green-100/30 
                    transition-all duration-300 font-light text-sm"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-light text-zinc-300 mb-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 bg-zinc-800/30 border border-green-100/20 
                    rounded-lg py-2 text-zinc-100 placeholder-zinc-500 
                    focus:outline-none focus:ring-2 focus:ring-green-100/30 focus:border-green-100/30 
                    transition-all duration-300 font-light text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 text-red-400 p-3 rounded-md text-sm font-light">
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-zinc-800/30 border border-green-100/20 
                text-zinc-100 rounded-lg transition-all duration-300 
                hover:bg-zinc-700/50 hover:border-green-100/40 
                focus:outline-none focus:ring-2 focus:ring-green-100/30
                font-light tracking-wide flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-zinc-300 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Criar conta
                  <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 