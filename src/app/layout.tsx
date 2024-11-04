import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <head>
        <style>
          {`
            body {
              font-family: Helvetica, Arial, sans-serif;
            }
          `}
        </style>
      </head>
      <body>{children}</body>
    </html>
  )
}
