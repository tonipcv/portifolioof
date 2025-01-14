import Image from 'next/image'

export function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="Logo"
      width={120}
      height={36}
      className="mx-auto mb-8 brightness-0 invert"
      priority
    />
  )
} 