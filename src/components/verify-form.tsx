'use client'

import { useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

export function VerifyForm() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId') || session?.user?.id
  
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return // Permite apenas um dígito

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Move para o próximo input se digitar um número
    if (value !== "" && index < 5) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move para o input anterior ao apertar backspace em um input vazio
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  async function onSendCode() {
    if (!userId) {
      setError("Usuário não identificado")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp: "+" + phone,
          userId
        })
      })

      const data = await res.json()

      if (data.success) {
        setCodeSent(true)
        // Foca no primeiro input quando mostrar os campos de código
        setTimeout(() => {
          inputRefs[0].current?.focus()
        }, 100)
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("Ocorreu um erro ao tentar enviar o código")
    } finally {
      setIsLoading(false)
    }
  }

  async function onVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    
    if (!userId) {
      setError("Usuário não identificado")
      return
    }

    const verificationCode = code.join("")
    if (verificationCode.length !== 6) {
      setError("Por favor, preencha todos os dígitos do código")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch("/api/auth/verify", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: verificationCode,
          whatsapp: "+" + phone,
          userId
        })
      })

      const data = await res.json()

      if (data.success) {
        router.push("/verify/success")
      } else {
        setError(data.error || "Erro ao verificar código")
      }
    } catch (error) {
      setError("Ocorreu um erro ao tentar verificar o código")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTryAgain = () => {
    setCodeSent(false)
    setCode(["", "", "", "", "", ""])
    setError(null)
  }

  const labelClasses = "block text-sm font-medium text-gray-400"
  const buttonClasses = "w-full px-5 py-4 border border-teal-400 rounded-lg text-sm font-semibold text-teal-400 bg-teal-400/10 hover:bg-teal-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
  const inputClasses = "!w-full !h-[60px] !pl-[70px] !pr-4 !bg-black/20 !border !border-gray-800 !rounded-lg !text-white !text-base placeholder:!text-gray-600 focus:!outline-none focus:!ring-2 focus:!ring-teal-400 focus:!border-transparent !transition-colors"
  const codeInputClasses = "w-14 h-14 text-center text-2xl bg-black/20 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-colors"

  return (
    <div className="mt-8">
      {!codeSent ? (
        <form onSubmit={(e) => { e.preventDefault(); onSendCode(); }} className="space-y-8" autoComplete="off">
          <div className="text-center">
            <h1 className="text-2xl font-normal text-teal-400">
              Verificar WhatsApp
            </h1>
          </div>

          <div className="space-y-2">
            <label className={labelClasses}>WhatsApp</label>
            <div className="relative">
              <PhoneInput
                country="br"
                value={phone}
                onChange={setPhone}
                inputClass={inputClasses}
                containerClass="!w-full"
                buttonClass="!absolute !left-1 !top-1/2 !-translate-y-1/2 !bg-transparent !border-0 !rounded-md !p-2 !transition-colors hover:!bg-black/20"
                dropdownClass="!bg-zinc-900 !text-gray-400 !text-base"
                searchClass="!bg-black/20 !border-gray-800 !text-gray-400"
                disabled={isLoading}
                enableSearch
                disableSearchIcon
                placeholder="11999999999"
              />
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Digite apenas os números com DDD (ex: 11999999999)
            </p>
          </div>

          {error && (
            <div className="bg-red-950/20 border border-red-900/30 rounded-lg px-5 py-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!phone || isLoading}
            className={buttonClasses}
          >
            {isLoading ? (
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
      ) : (
        <form onSubmit={onVerifyCode} className="space-y-8" autoComplete="off">
          <div className="text-center">
            <h1 className="text-2xl font-normal text-teal-400">
              Confirme seu número
            </h1>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={codeInputClasses}
                  required
                  disabled={isLoading}
                />
              ))}
            </div>
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
            disabled={code.some(digit => digit === "") || isLoading}
            className={buttonClasses}
          >
            {isLoading ? (
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
              onClick={handleTryAgain}
              className="text-teal-400 hover:text-teal-300 font-medium focus:outline-none"
            >
              Tentar novamente
            </button>
          </p>
        </form>
      )}
    </div>
  )
} 