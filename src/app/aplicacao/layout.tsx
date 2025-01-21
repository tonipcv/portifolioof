import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function AplicacaoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-[#111111]">
      <body className={`${inter.className} h-full bg-[#111111] text-white`}>
        <div className="min-h-screen bg-[#111111]">
          {children}
        </div>
      </body>
    </html>
  )
} 