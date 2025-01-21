export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 bg-[#111111]">
      {children}
    </div>
  )
} 