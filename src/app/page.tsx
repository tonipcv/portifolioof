import { MyPortfolio } from '@/components/MyPortfolio'
import { CryptoStats } from '@/components/CryptoStats'
import { PlusCircleIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-12">
          <CurrencyDollarIcon className="h-8 w-8 text-indigo-500" />
          <h1 className="text-3xl font-light text-white">
            K17 Assets
          </h1>
        </div>
        
        {/* Stats Section */}
        <div className="mb-8 bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
          <div className="flex items-center space-x-2 mb-6">
            <ChartBarIcon className="h-6 w-6 text-indigo-500" />
            <h2 className="text-xl font-light">Estatísticas Gerais</h2>
          </div>
          <CryptoStats />
        </div>
        
        {/* Portfolio Section */}
        <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="h-6 w-6 text-indigo-500" />
              <h2 className="text-xl font-light">Minhas Criptomoedas</h2>
            </div>
            <Link 
              href="/add-crypto"
              className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg text-white transition-colors"
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span>Adicionar Criptomoeda</span>
            </Link>
          </div>
          <MyPortfolio />
        </div>
      </div>
    </div>
  )
}
