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

    router.push('/carrinho');
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
    'Acompanhamento de portfólio',
    'Preços em tempo real',
    'Até 5 criptomoedas',
    'Dados de mercado',
  ];

  const premiumFeatures = [
    'Portfólio ilimitado',
    'Cursos exclusivos',
    'Análises avançadas',
    'Sinais de trading',
    'Suporte prioritário',
  ];

  const [selectedPlan, setSelectedPlan] = useState('annual');

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-zinc-100">
            Escolha seu plano
          </h2>
          {isPremium && (
            <div className="mt-2">
              <span className="text-sm text-zinc-400">
                Plano atual: Premium
              </span>
            </div>
          )}
          {error && (
            <p className="mt-2 text-red-400 text-sm">{error}</p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Plano Gratuito */}
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-zinc-100">Gratuito</h3>
                <p className="text-zinc-400 text-sm mt-1">Acesso básico</p>
              </div>
              <p className="text-2xl font-bold text-zinc-100">R$0</p>
            </div>
            <ul className="space-y-3 mb-6">
              {freeFeatures.map((feature, index) => (
                <li key={`free-${index}`} className="flex items-center text-sm">
                  <span className="text-zinc-400 mr-2">✓</span>
                  <span className="text-zinc-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Plano Premium */}
          <div className={`bg-zinc-900/50 rounded-lg p-6 border border-zinc-800/50 ${isPremium ? 'ring-1 ring-zinc-700' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-zinc-100">Premium</h3>
                <p className="text-zinc-400 text-sm mt-1">Acesso completo</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-zinc-100">
                  R${selectedPlan === 'annual' ? '147' : '247'}
                </p>
                <p className="text-sm text-zinc-400">por mês</p>
              </div>
            </div>
            
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSelectedPlan('annual')}
                className={`flex-1 py-1 px-3 rounded text-sm transition-colors ${
                  selectedPlan === 'annual'
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'bg-zinc-900 text-zinc-400'
                }`}
              >
                Anual
              </button>
              <button
                onClick={() => setSelectedPlan('semiannual')}
                className={`flex-1 py-1 px-3 rounded text-sm transition-colors ${
                  selectedPlan === 'semiannual'
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'bg-zinc-900 text-zinc-400'
                }`}
              >
                Semestral
              </button>
            </div>

            <ul className="space-y-3 mb-6">
              {premiumFeatures.map((feature, index) => (
                <li key={`premium-${index}`} className="flex items-center text-sm">
                  <span className="text-zinc-400 mr-2">✓</span>
                  <span className="text-zinc-300">{feature}</span>
                </li>
              ))}
            </ul>
            {isPremium ? (
              <button
                onClick={handleManageSubscription}
                disabled={isLoading}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 py-2 px-4 rounded text-sm transition-colors"
              >
                {isLoading ? 'Processando...' : 'Gerenciar Assinatura'}
              </button>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 py-2 px-4 rounded text-sm transition-colors"
              >
                {isLoading ? 'Processando...' : session ? 'Assinar Premium' : 'Fazer Login para Assinar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 