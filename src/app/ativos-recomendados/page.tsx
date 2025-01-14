'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { TrendingUp, Lock } from 'lucide-react';

export default function RecommendedAssetsPage() {
  const { data: session } = useSession();
  const isPremium = session?.user?.subscriptionStatus === 'premium';

  const recommendedAssets = [
    {
      name: 'Bitcoin (BTC)',
      price: '$43,567.89',
      change: '+5.67%',
      prediction: 'Forte tendência de alta',
      target: '$48,000',
      analysis: 'Suporte em $42k, resistência em $45k. Momento técnico favorável.',
    },
    {
      name: 'Ethereum (ETH)',
      price: '$2,345.67',
      change: '+3.45%',
      prediction: 'Acumulação',
      target: '$2,800',
      analysis: 'Formação de bandeira bullish no gráfico diário.',
    },
    {
      name: 'Solana (SOL)',
      price: '$98.76',
      change: '+8.90%',
      prediction: 'Compra',
      target: '$120',
      analysis: 'Rompimento de resistência importante com volume.',
    },
    {
      name: 'Cardano (ADA)',
      price: '$0.58',
      change: '+4.20%',
      prediction: 'Acumulação',
      target: '$0.75',
      analysis: 'Formação de suporte forte em $0.55, volume crescente.',
    },
    {
      name: 'Polkadot (DOT)',
      price: '$7.89',
      change: '+6.15%',
      prediction: 'Compra',
      target: '$9.50',
      analysis: 'Padrão de reversão formado, momentum positivo.',
    },
    {
      name: 'Chainlink (LINK)',
      price: '$15.34',
      change: '+7.80%',
      prediction: 'Forte tendência de alta',
      target: '$18.00',
      analysis: 'Quebra de resistência com alto volume, tendência de alta confirmada.',
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-['Helvetica']">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-light text-white">Ativos Recomendados</h1>
          {!isPremium && (
            <Link
              href="/pricing"
              className="border border-white bg-transparent hover:bg-white/10 text-white px-3 py-1.5 rounded-lg transition-colors text-sm"
            >
              Fazer Upgrade
            </Link>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendedAssets.map((asset, index) => (
            <div
              key={index}
              className="relative bg-[#222222] rounded-lg p-4 overflow-hidden border border-white/10"
            >
              {!isPremium && (
                <div className="absolute inset-0 bg-[#222222]/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                  <Lock className="w-6 h-6 text-gray-400 mb-2" />
                  <p className="text-gray-400 text-center px-4 text-sm">
                    Disponível apenas para membros premium
                  </p>
                  <Link
                    href="/pricing"
                    className="mt-3 text-blue-400 hover:text-blue-300 text-xs"
                  >
                    Fazer upgrade para ver →
                  </Link>
                </div>
              )}

              <div className={!isPremium ? 'blur-sm' : ''}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-medium text-white">{asset.name}</h3>
                    <p className="text-lg font-bold mt-0.5 text-white">{asset.price}</p>
                  </div>
                  <div className="text-blue-400 flex items-center text-sm">
                    <TrendingUp className="w-3.5 h-3.5 mr-1" />
                    {asset.change}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-xs">Previsão</p>
                    <p className="text-white text-sm">{asset.prediction}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Preço Alvo</p>
                    <p className="text-white text-sm">{asset.target}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Análise Técnica</p>
                    <p className="text-white text-sm">{asset.analysis}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-700">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Confiança</span>
                      <span className="text-blue-400">Alta</span>
                    </div>
                    <div className="mt-1.5 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 