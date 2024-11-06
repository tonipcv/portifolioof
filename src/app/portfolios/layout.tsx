export default function PortfoliosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#111111]">
      {children}
    </div>
  );
} 