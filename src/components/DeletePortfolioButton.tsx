'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'

interface DeletePortfolioButtonProps {
  portfolioId: string
  onDelete: () => void
}

export function DeletePortfolioButton({ portfolioId, onDelete }: DeletePortfolioButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/portfolio/${portfolioId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete portfolio')
      }

      onDelete()
    } catch (error) {
      console.error('Error deleting portfolio:', error)
      alert('Erro ao excluir portfolio')
    } finally {
      setIsDeleting(false)
      setShowConfirmation(false)
    }
  }

  if (showConfirmation) {
    return (
      <div className="absolute top-0 right-0 mt-2 mr-2 bg-[#222222] p-2 rounded-md shadow-lg z-10">
        <p className="text-sm text-gray-300 mb-2">Tem certeza?</p>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowConfirmation(false)}
            className="text-xs text-gray-400 hover:text-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs text-red-400 hover:text-red-300"
          >
            {isDeleting ? 'Excluindo...' : 'Confirmar'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        setShowConfirmation(true)
      }}
      className="absolute top-4 right-4 text-gray-400 hover:text-red-400"
    >
      <Trash2 size={16} />
    </button>
  )
} 