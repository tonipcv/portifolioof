'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import type { Crypto } from '@prisma/client'

export function CryptoList() {
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCryptos() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/crypto')
        if (!response.ok) {
          throw new Error('Falha ao carregar criptomoedas')
        }
        const data = await response.json()
        setCryptos(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
        setCryptos([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchCryptos()
  }, [])

  async function handleDelete(id: number) {
    if (confirm('Tem certeza que deseja excluir esta criptomoeda?')) {
      try {
        const response = await fetch(`/api/crypto/${id}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          setCryptos(prevCryptos => prevCryptos.filter(crypto => crypto.id !== id))
        }
      } catch (error) {
        console.error('Erro ao deletar criptomoeda:', error)
      }
    }
  }

  if (isLoading) {
    return <div className="text-center py-4 text-gray-400">Carregando...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-400">Erro: {error}</div>
  }

  if (cryptos.length === 0) {
    return <div className="text-center py-4 text-gray-400">Nenhuma criptomoeda encontrada.</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="pb-3 text-gray-400">Nome</th>
            <th className="pb-3 text-gray-400">Símbolo</th>
            <th className="pb-3 text-gray-400">Quantidade</th>
            <th className="pb-3 text-gray-400">Preço de Compra</th>
            <th className="pb-3 text-gray-400">Ações</th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map((crypto) => (
            <tr key={crypto.id} className="border-b border-gray-700/50">
              <td className="py-4">{crypto.name}</td>
              <td className="py-4">{crypto.symbol}</td>
              <td className="py-4">{crypto.amount}</td>
              <td className="py-4">R$ {crypto.buyPrice.toLocaleString()}</td>
              <td className="py-4">
                <div className="flex space-x-2">
                  <button 
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => {/* Implementar edição */}}
                  >
                    <PencilIcon className="h-5 w-5 text-indigo-500" />
                  </button>
                  <button 
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => handleDelete(crypto.id)}
                  >
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 