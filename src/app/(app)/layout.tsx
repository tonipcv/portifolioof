import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { redirect } from 'next/navigation'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#121214]">
      <Navbar session={session} />
      <main className="flex-1 md:pl-64 pt-[72px] md:pt-6">
        <div className="mx-auto w-full max-w-7xl px-4 py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
} 