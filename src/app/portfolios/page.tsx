import { PortfolioList } from '@/components/PortfolioList'
import { CreatePortfolioButton } from '@/components/CreatePortfolioButton'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Suspense } from 'react'

export default async function PortfoliosPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="bg-[#121214]">
      <div className="flex justify-between items-center mb-8">
        <div></div>
        <CreatePortfolioButton />
      </div>
      <Suspense fallback={
        <div className="animate-pulse">
          <div className="grid gap-4">
            <div className="h-32 bg-gray-700 rounded"></div>
            <div className="h-32 bg-gray-700 rounded"></div>
            <div className="h-32 bg-gray-700 rounded"></div>
          </div>
        </div>
      }>
        <PortfolioList />
      </Suspense>
    </div>
  )
} 