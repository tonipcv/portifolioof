'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function VerifySuccessPage() {
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

          <div className="flex justify-center mb-8">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-normal text-teal-400 mb-4">
            WhatsApp verificado!
          </h2>

          <p className="text-gray-400 mb-8">
            Seu WhatsApp foi verificado com sucesso. Agora você pode acessar a plataforma.
          </p>

          <Link
            href="/login"
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
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  )
} 