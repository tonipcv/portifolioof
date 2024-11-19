'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de checkout não encontrada');
      }
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
      setError('Erro ao iniciar o checkout. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Planos e Preços
          </h2>
          <p className="mt-4 text-xl text-gray-400">
            Escolha o plano ideal para você
          </p>
          {error && (
            <p className="mt-4 text-red-500">{error}</p>
          )}
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto">
          {/* Plano Gratuito */}
          <div className="border border-gray-700 rounded-lg shadow-sm divide-y divide-gray-700 bg-gray-800">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white">Gratuito</h3>
              <p className="mt-4 text-gray-300">Acesso básico à plataforma</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-white">R$0</span>
                <span className="text-base font-medium text-gray-300">/mês</span>
              </p>
            </div>
          </div>

          {/* Plano Premium */}
          <div className="border border-blue-500 rounded-lg shadow-sm divide-y divide-gray-700 bg-gray-800">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white">Premium</h3>
              <p className="mt-4 text-gray-300">Acesso completo aos cursos</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-white">R$29</span>
                <span className="text-base font-medium text-gray-300">/mês</span>
              </p>
              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Processando...' : session ? 'Assinar Premium' : 'Fazer Login para Assinar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 