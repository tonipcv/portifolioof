'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

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

    const checkoutUrl = selectedPlan === 'annual' 
      ? 'https://checkout.k17.com.br/subscribe/anual-cryph'
      : 'https://checkout.k17.com.br/subscribe/semestral-cryph';
    
    window.location.href = checkoutUrl;
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
    <div className="min-h-screen bg-[#121214] px-4">
      <div className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl font-light text-zinc-100">
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

          <div className="grid gap-4 md:grid-cols-2">
            {/* Plano Gratuito */}
            <div className="bg-[#161616] rounded-lg p-6 border border-white/10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-light text-zinc-100">Gratuito</h3>
                  <p className="text-zinc-400 text-sm mt-1">Acesso básico</p>
                </div>
                <p className="text-xl font-light text-zinc-100">R$0</p>
              </div>
              <ul className="space-y-3 mb-6">
                {freeFeatures.map((feature, index) => (
                  <li key={`free-${index}`} className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-zinc-400 mr-2 flex-shrink-0" />
                    <span className="text-zinc-300 font-light">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Plano Premium */}
            <div className="bg-[#161616] rounded-lg p-6 border border-white/10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-light text-zinc-100">Premium</h3>
                  <p className="text-zinc-400 text-sm mt-1">Acesso completo</p>
                </div>
                <div className="text-right">
                  {selectedPlan === 'annual' ? (
                    <>
                      <div className="text-[10px] text-green-400 mb-1">52% OFF</div>
                      <p className="text-xl font-light text-zinc-100">R$197</p>
                    </>
                  ) : (
                    <p className="text-xl font-light text-zinc-100">R$400</p>
                  )}
                  <p className="text-xs text-zinc-400 mt-0.5">por mês</p>
                </div>
              </div>
              
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setSelectedPlan('annual')}
                  className={`flex-1 py-1.5 px-3 rounded text-xs transition-colors ${
                    selectedPlan === 'annual'
                      ? 'bg-white/10 text-zinc-100'
                      : 'bg-transparent text-zinc-400 hover:text-zinc-300'
                  }`}
                >
                  Anual
                </button>
                <button
                  onClick={() => setSelectedPlan('semiannual')}
                  className={`flex-1 py-1.5 px-3 rounded text-xs transition-colors ${
                    selectedPlan === 'semiannual'
                      ? 'bg-white/10 text-zinc-100'
                      : 'bg-transparent text-zinc-400 hover:text-zinc-300'
                  }`}
                >
                  Semestral
                </button>
              </div>

              <ul className="space-y-3 mb-6">
                {premiumFeatures.map((feature, index) => (
                  <li key={`premium-${index}`} className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-zinc-400 mr-2 flex-shrink-0" />
                    <span className="text-zinc-300 font-light">{feature}</span>
                  </li>
                ))}
              </ul>
              {isPremium ? (
                <button
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                  className="w-full bg-white/5 hover:bg-white/10 text-zinc-100 py-2 px-4 rounded text-sm transition-colors font-light"
                >
                  {isLoading ? 'Processando...' : 'Gerenciar Assinatura'}
                </button>
              ) : (
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="w-full bg-white/5 hover:bg-white/10 text-zinc-100 py-2 px-4 rounded text-sm transition-colors font-light"
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