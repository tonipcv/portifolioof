import { Metadata } from "next"
import Image from "next/image"
import { VerifyForm } from "@/components/verify-form"

export const metadata: Metadata = {
  title: "Verificação de WhatsApp",
  description: "Verifique seu número de WhatsApp",
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-helvetica">
      <div className="w-full max-w-sm px-8 py-10 bg-zinc-900/30 backdrop-blur-sm rounded-lg border border-green-100/20">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={36}
            className="mx-auto mb-8 brightness-0 invert"
          />
        </div>
        <VerifyForm />
      </div>
    </div>
  )
} 