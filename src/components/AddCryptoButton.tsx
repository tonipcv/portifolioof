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
  const [subscriptionStatus, setSubscriptionStatus] = useState('free')
  const router = useRouter()

  const fetchCryptoCount = async () => {
    const response = await fetch(`/api/portfolios/${portfolioId}/crypto-count`)
    const data = await response.json()
    setCryptoCount(data.count)
    setSubscriptionStatus(data.subscriptionStatus)
  }

  useEffect(() => {
    fetchCryptoCount()
  }, [portfolioId])

  const handleClick = () => {
    if (subscriptionStatus === 'free' && cryptoCount >= 3) {
      router.push('/upgrade')
      return
    }
    setIsModalOpen(true)
  }

  return (
    <>
      <button
        onClick={() => subscriptionStatus === 'free' && cryptoCount >= 3 
          ? router.push('/upgrade') 
          : setIsModalOpen(true)
        }
        className="inline-flex items-center justify-center rounded-md bg-transparent border-2 border-white/20 transition-colors hover:bg-white/10"
      >
        {subscriptionStatus === 'free' && cryptoCount >= 3 ? (
          <span className="px-2.5 py-1.5 text-sm font-semibold text-gray-300">
            Fazer Upgrade
          </span>
        ) : (
          <>
            <Plus className="h-8 w-8 sm:h-5 sm:w-5 p-1 sm:p-0 text-gray-300" />
            <span className="hidden sm:inline px-2.5 py-1.5 text-sm font-semibold text-gray-300">
              Adicionar Criptomoeda
            </span>
          </>
        )}
      </button>

      {subscriptionStatus === 'free' && cryptoCount >= 2 && cryptoCount < 3 && (
        <div className="text-sm text-yellow-500 mt-2">
          Você está usando {cryptoCount}/3 criptomoedas disponíveis no plano gratuito
        </div>
      )}

      {/* Só renderiza o modal se não atingiu o limite */}
      {(!subscriptionStatus || subscriptionStatus !== 'free' || cryptoCount < 3) && (
        <AddCryptoModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          portfolioId={portfolioId}
          onSuccess={() => {
            onSuccess?.()
            fetchCryptoCount()
          }}
        />
      )}
    </>
  )
} 