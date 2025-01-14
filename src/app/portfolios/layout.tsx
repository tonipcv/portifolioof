import { ReactNode } from 'react'

export default function PortfoliosLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      {children}
    </div>
  )
} 