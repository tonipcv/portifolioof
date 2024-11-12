import { CreatePortfolioButton } from '@/components/CreatePortfolioButton'
import { PortfolioList } from '@/components/PortfolioList'
import { LogoutButton } from '@/components/LogoutButton'
import { getServerSession } from "next-auth"
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function PortfoliosPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">
            Seus Portfolios
          </h1>
          <LogoutButton />
        </div>
        <CreatePortfolioButton />
      </div>
      <div className="min-h-[calc(100vh-200px)]">
        <PortfolioList />
      </div>
    </div>
  )
} 