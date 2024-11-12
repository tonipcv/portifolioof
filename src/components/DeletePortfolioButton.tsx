'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'

interface DeletePortfolioButtonProps {
  portfolioId: string
  onDelete: () => void
}

export function DeletePortfolioButton({ portfolioId, onDelete }: DeletePortfolioButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    
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
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    setShowConfirm(true)
  }

  function handleCancel(e: React.MouseEvent) {
    e.stopPropagation()
    setShowConfirm(false)
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="invisible group-hover:visible p-1 hover:text-red-400 transition-colors"
        title="Excluir portfolio"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {showConfirm && (
        <div 
          className="absolute right-0 top-0 z-10 w-48 rounded-md bg-[#222222] shadow-lg ring-1 ring-black ring-opacity-5"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-3">
            <p className="text-sm text-gray-200 mb-3">Confirmar exclusão?</p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 rounded-md bg-red-500 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 rounded-md bg-[#333333] px-2 py-1 text-sm font-semibold text-gray-200 shadow-sm hover:bg-[#444444]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 