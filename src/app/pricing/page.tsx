'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const isPremium = session?.user?.subscriptionStatus === 'premium';

  const handleSubscribe = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    window.location.href = 'https://checkout.k17.com.br/subscribe/ars';
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Erro ao abrir portal:', error);
      setError('Erro ao gerenciar assinatura. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const freeFeatures = [
    'Acompanhamento básico de portfólio',
    'Visualização de preços em tempo real',
    'Até 5 criptomoedas por portfólio',
    'Dados básicos de mercado',
  ];

  const premiumFeatures = [
    'Acesso a todos os cursos',
    'Analytics avançado',
    'Portfólio ilimitado',
    'Sinais de trading em tempo real',
    'Alertas personalizados',
    'Suporte prioritário',
    'APIs avançadas',
    'Relatórios detalhados',
    'Ferramentas de análise técnica',
    'Integração com exchanges',
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Planos e Preços
          </h2>
          {isPremium && (
            <div className="mt-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Seu plano atual: Premium
              </span>
            </div>
          )}
          <p className="mt-4 text-xl text-gray-400">
            Escolha o plano ideal para você
          </p>
          {error && (
            <p className="mt-4 text-red-500">{error}</p>
          )}
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto">
          {/* Plano Gratuito */}
          <div className={`border rounded-lg shadow-sm divide-y divide-gray-700 bg-gray-800 
            ${!isPremium ? 'border-gray-700' : 'border-gray-700 opacity-75'}`}>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white">Gratuito</h3>
              <p className="mt-4 text-gray-300">Acesso básico à plataforma</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-white">R$0</span>
                <span className="text-base font-medium text-gray-300">/mês</span>
              </p>
              {isPremium && (
                <div className="mt-8">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-300">
                    Plano Atual: Premium
                  </span>
                </div>
              )}
              <ul className="mt-6 space-y-4">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-300">{feature}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Plano Premium */}
          <div className={`border rounded-lg shadow-sm divide-y divide-gray-700 bg-gray-800 
            ${isPremium ? 'border-blue-500 ring-2 ring-blue-500' : 'border-blue-500'}`}>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white">Premium</h3>
              {isPremium && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Seu plano atual
                </span>
              )}
              <p className="mt-4 text-gray-300">Acesso completo</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-white">R$97</span>
                <span className="text-base font-medium text-gray-300">/mês</span>
              </p>
              <ul className="mt-6 space-y-4">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-300">{feature}</p>
                  </li>
                ))}
              </ul>
              {isPremium ? (
                <button
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                  className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Processando...' : 'Gerenciar Assinatura'}
                </button>
              ) : (
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Processando...' : session ? 'Assinar Premium' : 'Fazer Login para Assinar'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 