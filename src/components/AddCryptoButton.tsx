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
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
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