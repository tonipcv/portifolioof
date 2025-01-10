export default function OnboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="dark">
      <body className="min-h-screen bg-[#121214]">
        <main className="min-h-screen flex items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  )
} 