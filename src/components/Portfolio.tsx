'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import AddCryptoButton from './AddCryptoButton'
import AssetsList from './AssetsList'

interface PortfolioProps {
  portfolioId: string
}

const MyPortfolio = dynamic(() => import('@/components/MyPortfolio'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="text-lg">Loading chart...</div>
    </div>
  ),
})

export default function Portfolio({ portfolioId }: PortfolioProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Visão Geral do Portfólio</h2>
        <AddCryptoButton portfolioId={portfolioId} />
      </div>
      
      <div className="bg-gray-900 rounded-lg p-4">
        <Suspense 
          fallback={
            <div className="flex items-center justify-center p-8">
              <div className="text-lg text-gray-300">Carregando...</div>
            </div>
          }
        >
          <MyPortfolio portfolioId={portfolioId} />
        </Suspense>
      </div>

      <div className="bg-gray-900 rounded-lg p-4">
        <AssetsList portfolioId={portfolioId} onUpdate={() => {}} />
      </div>
    </div>
  )
} 