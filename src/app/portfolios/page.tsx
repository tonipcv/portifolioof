import { CreatePortfolioButton } from '@/components/CreatePortfolioButton'
import { PortfolioList } from '@/components/PortfolioList'

export default function PortfoliosPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Seus Portfolios</h1>
        <CreatePortfolioButton />
      </div>
      <PortfolioList />
    </div>
  )
} 