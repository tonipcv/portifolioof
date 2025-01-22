'use client'

import * as React from 'react'
import { useState } from 'react'
import { Mail, Lock, User, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'register' | 'verify'>('register')
  const [userId, setUserId] = useState<string | null>(null)
  const [code, setCode] = useState('')

  const validateForm = () => {
    if (name.length < 3) {
      setError('Nome deve ter pelo menos 3 caracteres')
      return false
    }
    
    if (!email.includes('@')) {
      setError('Email inválido')
      return false
    }

    if (whatsapp.length < 11) {
      setError('WhatsApp deve ter pelo menos 11 dígitos')
      return false
    }

    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const formattedWhatsapp = `+55${whatsapp}`
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          whatsapp: formattedWhatsapp, 
          password 
        })
      })

      const data = await response.json()

      if (data.success) {
        setUserId(data.userId)
        setStep('verify')
      } else {
        setError(data.message || 'Erro ao cadastrar usuário')
      }
    } catch (error) {
      console.error('Erro ao registrar:', error)
      setError(error instanceof Error ? error.message : 'Falha ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, 
          whatsapp: `+55${whatsapp}`,
          userId
        })
      })

      const data = await response.json()

      if (data.success) {
        window.location.href = '/login'
      } else {
        setError(data.error || 'Código inválido')
      }
    } catch (error) {
      setError('Erro ao verificar código')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp: `+55${whatsapp}`, userId })
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Erro ao reenviar código')
      }
    } catch (error) {
      setError('Erro ao reenviar código')
    } finally {
      setIsLoading(false)
    }
  }

  const renderRegisterForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="block w-full pl-10 bg-zinc-800/30 border border-green-100/20 
              rounded-lg py-2 text-zinc-100 placeholder-zinc-500 
              focus:outline-none focus:ring-2 focus:ring-green-100/30 focus:border-green-100/30 
              transition-all duration-300 font-light text-sm"
            placeholder="Seu nome completo"
          />
        </div>
        <p className="mt-1 text-xs text-zinc-500 font-light">Mínimo de 3 caracteres</p>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block w-full pl-10 bg-zinc-800/30 border border-green-100/20 
              rounded-lg py-2 text-zinc-100 placeholder-zinc-500 
              focus:outline-none focus:ring-2 focus:ring-green-100/30 focus:border-green-100/30 
              transition-all duration-300 font-light text-sm"
            placeholder="seu@email.com"
          />
        </div>
        <p className="mt-1 text-xs text-zinc-500 font-light">Será usado para login</p>
      </div>

      <div>
        <label htmlFor="whatsapp" className="block text-sm font-light text-zinc-300 mb-1">
          WhatsApp
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-zinc-500" />
          </div>
          <div className="absolute inset-y-0 left-8 pl-3 flex items-center pointer-events-none">
            <span className="text-zinc-500 text-sm">+55</span>
          </div>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
            required
            className="block w-full pl-20 bg-zinc-800/30 border border-green-100/20 
              rounded-lg py-2 text-zinc-100 placeholder-zinc-500 
              focus:outline-none focus:ring-2 focus:ring-green-100/30 focus:border-green-100/30 
              transition-all duration-300 font-light text-sm"
            placeholder="11999999999"
            maxLength={11}
          />
        </div>
        <p className="mt-1 text-xs text-zinc-500 font-light">DDD + número (apenas números)</p>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="block w-full pl-10 bg-zinc-800/30 border border-green-100/20 
              rounded-lg py-2 text-zinc-100 placeholder-zinc-500 
              focus:outline-none focus:ring-2 focus:ring-green-100/30 focus:border-green-100/30 
              transition-all duration-300 font-light text-sm"
            placeholder="••••••••"
          />
        </div>
        <p className="mt-1 text-xs text-zinc-500 font-light">Mínimo de 6 caracteres</p>
      </div>

      {error && (
        <div className="bg-red-900/20 text-red-400 p-3 rounded-md text-sm font-light">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 bg-zinc-800/30 border border-green-100/20 
          text-zinc-100 rounded-lg transition-all duration-300 
          hover:bg-zinc-700/50 hover:border-green-100/40 
          focus:outline-none focus:ring-2 focus:ring-green-100/30
          font-light tracking-wide flex items-center justify-center
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-zinc-300 border-t-transparent rounded-full animate-spin" />
        ) : (
          'Criar Conta'
        )}
      </button>

      <div className="text-center">
        <Link 
          href="/login"
          className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors duration-300 font-light"
        >
          Já tem uma conta? Faça login
        </Link>
      </div>
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
          className="block w-full text-center text-xl tracking-[0.5em] bg-zinc-800/30 border border-green-100/20 
            rounded-lg py-2 text-zinc-100 placeholder-zinc-500 
            focus:outline-none focus:ring-2 focus:ring-green-100/30 focus:border-green-100/30 
            transition-all duration-300 font-light h-14"
          required
          autoComplete="off"
          spellCheck="false"
        />
        <p className="text-xs text-zinc-500 text-center">
          Digite o código de 6 dígitos enviado para seu WhatsApp
        </p>
      </div>

      {error && (
        <div className="bg-red-900/20 text-red-400 p-3 rounded-md text-sm font-light">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 bg-zinc-800/30 border border-green-100/20 
          text-zinc-100 rounded-lg transition-all duration-300 
          hover:bg-zinc-700/50 hover:border-green-100/40 
          focus:outline-none focus:ring-2 focus:ring-green-100/30
          font-light tracking-wide flex items-center justify-center
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-zinc-300 border-t-transparent rounded-full animate-spin" />
        ) : (
          'Verificar código'
        )}
      </button>

      <p className="text-center text-xs text-zinc-500">
        Não recebeu o código?{" "}
        <button
          type="button"
          onClick={handleResendCode}
          className="text-white hover:text-zinc-300 font-medium focus:outline-none"
        >
          Tentar novamente
        </button>
      </p>
    </form>
  )

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
          <div className="text-center mb-6">
            <h2 className="text-zinc-100 text-xl font-light mb-2">Criar Conta</h2>
            <p className="text-zinc-400 text-sm font-light">
              Preencha os dados abaixo para criar sua conta
            </p>
          </div>

          {step === 'register' ? renderRegisterForm() : renderVerifyForm()}
        </div>
      </div>
    </div>
  )
} 