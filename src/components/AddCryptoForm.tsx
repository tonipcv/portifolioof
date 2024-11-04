'use client'

import React from 'react'
import { useState } from 'react'

interface FormData {
  name: string
  amount: string
  price: string
}

export function AddCryptoForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    amount: '',
    price: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/crypto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          amount: formData.amount,
          price: formData.price,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add crypto')
      }

      // Limpar formulário após sucesso
      setFormData({
        name: '',
        amount: '',
        price: ''
      })

      // Recarregar a página para atualizar a lista
      window.location.reload()
    } catch (error) {
      console.error('Error adding crypto:', error)
      alert('Erro ao adicionar criptomoeda')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-gray-400 font-light mb-1">
            Nome da Crypto
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Bitcoin"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 font-light mb-1">
            Quantidade
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            step="any"
            className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="0.5"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 font-light mb-1">
            Preço de Compra
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="any"
            className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="150000"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-light py-2 px-4 rounded-lg transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
      </div>
    </form>
  )
} 