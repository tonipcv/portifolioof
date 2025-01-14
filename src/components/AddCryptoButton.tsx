'use client'

import { Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import AddCryptoModal from './AddCryptoModal'
import { useRouter } from 'next/navigation'

interface AddCryptoButtonProps {
  portfolioId: string
  onSuccess?: () => void
}

export function AddCryptoButton({ portfolioId, onSuccess }: AddCryptoButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cryptoCount, setCryptoCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchCryptoCount = async () => {
      const response = await fetch(`/api/portfolio/${portfolioId}/crypto-count`)
      const data = await response.json()
      setCryptoCount(data.count)
    }
    fetchCryptoCount()
  }, [portfolioId])

  const handleClick = () => {
    if (cryptoCount >= 3) {
      window.location.href = 'https://checkout.k17.com.br/subscribe/ars'
      return
    }
    setIsModalOpen(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="inline-flex items-center justify-center rounded-md bg-transparent border-2 border-white/20 transition-colors hover:bg-white/10"
      >
        <Plus className="h-8 w-8 sm:h-5 sm:w-5 p-1 sm:p-0 text-gray-300" />
        <span className="hidden sm:inline px-2.5 py-1.5 text-sm font-semibold text-gray-300">
          {cryptoCount >= 3 ? 'Fazer Upgrade' : 'Adicionar Criptomoeda'}
        </span>
      </button>

      {cryptoCount >= 2 && cryptoCount < 3 && (
        <div className="text-xs text-zinc-500 mt-2">
          {cryptoCount}/3 criptos
        </div>
      )}

      <AddCryptoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        portfolioId={portfolioId}
        onSuccess={onSuccess}
      />
    </>
  )
} 