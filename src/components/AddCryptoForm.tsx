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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const cryptoData = {
      name: formData.name,
      symbol: formData.name.substring(0, 3).toUpperCase(), // Gera um símbolo a partir do nome
      amount: parseFloat(formData.amount),
      buyPrice: parseFloat(formData.price),
      currentPrice: parseFloat(formData.price)
    }

    console.log('Enviando dados:', cryptoData)

    try {
      const response = await fetch('/api/crypto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cryptoData),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Erro na resposta:', errorData)
        throw new Error('Falha ao adicionar criptomoeda')
      }

      const data = await response.json()
      console.log('Resposta do servidor:', data)
      
      // Limpa o formulário
      setFormData({
        name: '',
        amount: '',
        price: ''
      })

      // Recarregar a página para atualizar a lista
      window.location.reload()
    } catch (error) {
      console.error('Erro ao adicionar:', error)
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