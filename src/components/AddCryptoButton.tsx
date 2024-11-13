'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import AddCryptoModal from './AddCryptoModal'

interface AddCryptoButtonProps {
  portfolioId: string
  onSuccess?: () => void
}

export function AddCryptoButton({ portfolioId, onSuccess }: AddCryptoButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center justify-center rounded-md bg-transparent border-2 border-white/20 transition-colors hover:bg-white/10"
      >
        <Plus className="h-8 w-8 sm:h-5 sm:w-5 p-1 sm:p-0 text-gray-300" />
        <span className="hidden sm:inline px-2.5 py-1.5 text-sm font-semibold text-gray-300">
          Adicionar Criptomoeda
        </span>
      </button>

      <AddCryptoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        portfolioId={portfolioId}
        onSuccess={onSuccess}
      />
    </>
  )
} 