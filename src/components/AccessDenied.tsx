import { LockKeyhole } from 'lucide-react'
import Link from 'next/link'

interface AccessDeniedProps {
  title?: string
  message?: string
  actionLink?: string
  actionText?: string
}

export function AccessDenied({
  title = "Acesso Restrito",
  message = "Esta área está disponível apenas para membros premium.",
  actionLink = "/pricing",
  actionText = "Fazer Upgrade para Premium"
}: AccessDeniedProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="bg-[#1a1a1a] p-8 rounded-lg border border-white/10">
          <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <LockKeyhole className="w-8 h-8 text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-3">
            {title}
          </h1>
          
          <p className="text-gray-400 mb-6">
            {message}
          </p>
          
          <Link
            href={actionLink}
            className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
          >
            {actionText}
          </Link>

          <div className="mt-6 pt-6 border-t border-white/10">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Voltar para Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 