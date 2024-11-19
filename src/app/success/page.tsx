'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      router.push('/');
      return;
    }

    const checkStatus = async () => {
      try {
        const response = await fetch('/api/user/subscription');
        const data = await response.json();

        if (data.subscriptionStatus === 'premium') {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
        setStatus('error');
      }
    };

    checkStatus();
  }, [sessionId, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Processando seu pagamento...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">
            Ops! Algo deu errado.
          </h2>
          <p className="mb-4">Não foi possível confirmar sua assinatura.</p>
          <button
            onClick={() => router.push('/pricing')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Voltar para Preços
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-green-500">
          <svg
            className="h-16 w-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-4">Parabéns!</h2>
        <p className="mb-8">Sua assinatura premium foi ativada com sucesso.</p>
        <button
          onClick={() => router.push('/courses')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Acessar Cursos
        </button>
      </div>
    </div>
  );
} 