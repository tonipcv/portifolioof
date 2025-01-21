import { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/login-form'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Login',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-helvetica">
      <div className="w-full max-w-sm px-8 py-10 bg-zinc-950/70 backdrop-blur-sm rounded-lg border border-zinc-600">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={36}
            className="mx-auto mb-8 brightness-0 invert"
            priority
          />
        </div>

        <div className="mt-8 font-helvetica">
          <LoginForm />
          <div className="mt-6 flex justify-between text-sm font-light tracking-wide">
            <Link
              href="/register"
              className="text-zinc-400 hover:text-green-100/90 transition-colors duration-300"
            >
              Criar conta
            </Link>
            <Link
              href="/forgot-password"
              className="text-zinc-400 hover:text-green-100/90 transition-colors duration-300"
            >
              Esqueceu sua senha?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 