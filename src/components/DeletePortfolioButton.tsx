'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeletePortfolioButtonProps {
  portfolioId: string
}

export default function DeletePortfolioButton({ portfolioId }: DeletePortfolioButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (window.confirm('Tem certeza que deseja excluir este portfólio?')) {
      setIsDeleting(true)
      try {
        const response = await fetch(`/api/portfolios/${portfolioId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Erro ao deletar portfólio')
        }

        router.refresh()
      } catch (error) {
        console.error('Erro ao deletar portfólio:', error)
        alert('Erro ao deletar portfólio')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="absolute top-2 right-2 p-2 rounded-full bg-[#222222] opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all duration-200 z-10"
      title="Excluir portfólio"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
} 