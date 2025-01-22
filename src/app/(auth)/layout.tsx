import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/portfolios')
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#121214]">
      <div className="w-full max-w-[400px] space-y-6 px-4">
        {children}
      </div>
    </main>
  )
} 