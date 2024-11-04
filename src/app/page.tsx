import PortfolioList from '@/components/PortfolioList'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
      <PortfolioList />
    </div>
  )
}
