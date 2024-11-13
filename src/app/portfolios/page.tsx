import { PortfolioList } from '@/components/PortfolioList'
import { CreatePortfolioButton } from '@/components/CreatePortfolioButton'

export default function PortfoliosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Seus Portfolios</h1>
        <CreatePortfolioButton />
      </div>
      <PortfolioList />
    </div>
  )
} 