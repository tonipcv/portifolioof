import PortfolioList from '@/components/PortfolioList'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white">Portfólio Crypto</h1>
        <PortfolioList />
      </div>
    </main>
  )
}
