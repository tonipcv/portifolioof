'use client'

import React, { useState, useEffect } from 'react'

interface FormData {
  name: string
  amount: string
  price: string
}

interface Coin {
  id: string
  symbol: string
  name: string
  thumb?: string
}

export function AddCryptoForm() {
  const [loading, setLoading] = useState(false)
  const [coins, setCoins] = useState<Coin[]>([])
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    amount: '',
    price: ''
  })
  const [inputFocused, setInputFocused] = useState(false)

  useEffect(() => {
    const fetchCoins = async () => {
      const url = 'https://pro-api.coingecko.com/api/v3/coins/list'
      const options = {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-cg-pro-api-key': 'CG-hpbLQhyhxzcJJyUkjQdBjkPc'
        }
      }

      try {
        const response = await fetch(url, options)
        
        if (!response.ok) {
          const errorData = await response.text()
          console.error('Status:', response.status)
          console.error('Erro na resposta da API:', errorData)
          throw new Error(`Falha ao carregar moedas: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Total de moedas carregadas:', data.length)
        
        const sortedCoins = data.sort((a: Coin, b: Coin) => 
          a.name.localeCompare(b.name)
        )
        
        setCoins(sortedCoins)
        setFilteredCoins(sortedCoins)
      } catch (error) {
        console.error('Erro ao carregar lista de moedas:', error)
        alert('Erro ao carregar lista de criptomoedas. Por favor, tente novamente.')
      }
    }

    fetchCoins()
  }, [])

  const formatBRL = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, '')
    if (!onlyNumbers) return '0,00'
    
    const numberValue = Number(onlyNumbers) / 100
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numberValue)
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setFormData(prev => ({
      ...prev,
      price: value
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'price') {
      handlePriceChange(e)
      return
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      name: value
    }))
    
    if (value.length > 0) {
      const filtered = coins.filter(coin => 
        coin.name.toLowerCase().includes(value.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredCoins(filtered)
    } else {
      setFilteredCoins(coins)
    }
  }

  const handleInputFocus = () => {
    setInputFocused(true)
    setShowDropdown(true)
    setFilteredCoins(coins)
  }

  const handleInputBlur = (e: React.FocusEvent) => {
    setTimeout(() => {
      setInputFocused(false)
      setShowDropdown(false)
    }, 200)
  }

  const selectCoin = (coin: Coin) => {
    setFormData(prev => ({
      ...prev,
      name: coin.name
    }))
    setShowDropdown(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const priceInBRL = parseFloat(formData.price) / 100
    const selectedCoin = coins.find(coin => 
      coin.name.toLowerCase() === formData.name.toLowerCase()
    )

    const cryptoData = {
      name: formData.name,
      symbol: selectedCoin?.symbol.toUpperCase() || formData.name.substring(0, 3).toUpperCase(),
      amount: parseFloat(formData.amount),
      buyPrice: priceInBRL,
      currentPrice: priceInBRL
    }

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
      
      setFormData({
        name: '',
        amount: '',
        price: ''
      })

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
        <div className="relative">
          <label className="block text-sm text-gray-200 font-light mb-1">
            Nome da Crypto
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            required
            className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400"
            placeholder="Pesquisar ou selecionar cripto"
          />
          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredCoins.length > 0 ? (
                filteredCoins.map((coin) => (
                  <div
                    key={coin.id}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white flex items-center"
                    onClick={() => selectCoin(coin)}
                  >
                    <div>
                      <span className="font-medium">{coin.name}</span>
                      <span className="text-gray-400 ml-2">({coin.symbol.toUpperCase()})</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-400">
                  Nenhuma criptomoeda encontrada
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-200 font-light mb-1">
            Quantidade
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            step="any"
            className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400"
            placeholder="0.5"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-200 font-light mb-1">
            Preço de Compra (R$)
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-300 sm:text-sm">R$</span>
            </div>
            <input
              type="text"
              name="price"
              value={formatBRL(formData.price)}
              onChange={handleChange}
              required
              className="w-full bg-gray-800/30 border border-gray-700/50 rounded-lg pl-10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400"
              placeholder="0,00"
            />
          </div>
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