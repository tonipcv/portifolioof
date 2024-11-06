'use client'

import { PlusIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import AddCryptoModal from './AddCryptoModal'

interface AddCryptoButtonProps {
  portfolioId: string
}

export default function AddCryptoButton({ portfolioId }: AddCryptoButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-transparent border-2 border-white text-white px-4 py-2 rounded-lg transition-colors hover:bg-white/10"
      >
        <PlusIcon className="h-5 w-5" />
        Adicionar Crypto
      </button>

      <AddCryptoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        portfolioId={portfolioId}
      />
    </>
  )
} 