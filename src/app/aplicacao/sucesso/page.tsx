import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SucessoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
        <h2 className="mt-6 text-3xl font-bold text-white">
          Solicitação Enviada!
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Sua solicitação foi enviada com sucesso. Em breve entraremos em contato através do email fornecido.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  )
} 