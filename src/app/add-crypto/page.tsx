'use client'

import React from 'react'
import { CryptoList } from '@/components/CryptoList'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function AddCrypto() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-8">
        <Link 
          href="/"
          className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Voltar ao Portfolio</span>
        </Link>
        
        <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
          <h2 className="text-xl font-light mb-6">Adicionar Nova Criptomoeda</h2>
          <CryptoList />
        </div>
      </div>
    </div>
  )
} 