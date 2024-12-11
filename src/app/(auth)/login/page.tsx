import { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/LoginForm'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Login',
}

export default function LoginPage() {
  return (
    <>
      <div className="fixed inset-0 bg-[#111111] flex items-center justify-center">
        <div className="w-full max-w-sm px-4">
          <div className="text-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={36}
              className="mx-auto mb-8 brightness-0 invert"
            />
          </div>

          <div className="mt-8">
            <LoginForm />
            <div className="mt-4 flex justify-between text-sm">
              <Link
                href="/register"
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                Criar conta
              </Link>
              <Link
                href="/forgot-password"
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 