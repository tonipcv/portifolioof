import { CryptoList } from '@/components/CryptoList'
import { CryptoStats } from '@/components/CryptoStats'
import { AddCryptoForm } from '@/components/AddCryptoForm'
import { PlusCircleIcon, ChartBarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

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
        <div className="mb-12 bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
          <div className="flex items-center space-x-2 mb-6">
            <ChartBarIcon className="h-6 w-6 text-indigo-500" />
            <h2 className="text-xl font-light">Estatísticas Gerais</h2>
          </div>
          <CryptoStats />
        </div>
        
        {/* Add Crypto Form Section */}
        <div className="mb-12 bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
          <div className="flex items-center space-x-2 mb-6">
            <PlusCircleIcon className="h-6 w-6 text-indigo-500" />
            <h2 className="text-xl font-light">Adicionar Nova Criptomoeda</h2>
          </div>
          <AddCryptoForm />
        </div>
        
        {/* Crypto List Section */}
        <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
          <div className="flex items-center space-x-2 mb-6">
            <CurrencyDollarIcon className="h-6 w-6 text-indigo-500" />
            <h2 className="text-xl font-light">Minhas Criptomoedas</h2>
          </div>
          <CryptoList />
        </div>
      </div>
    </div>
  )
}
