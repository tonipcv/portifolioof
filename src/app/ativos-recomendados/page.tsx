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
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Ativos Recomendados</h1>
          {!isPremium && (
            <Link
              href="/pricing"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Fazer Upgrade
            </Link>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendedAssets.map((asset, index) => (
            <div
              key={index}
              className="relative bg-[#222222] rounded-lg p-6 overflow-hidden border border-white/10"
            >
              {!isPremium && (
                <div className="absolute inset-0 bg-[#222222]/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                  <Lock className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-gray-400 text-center px-4">
                    Disponível apenas para membros premium
                  </p>
                  <Link
                    href="/pricing"
                    className="mt-4 text-green-400 hover:text-green-300 text-sm"
                  >
                    Fazer upgrade para ver →
                  </Link>
                </div>
              )}

              <div className={!isPremium ? 'blur-sm' : ''}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{asset.name}</h3>
                    <p className="text-2xl font-bold mt-1 text-white">{asset.price}</p>
                  </div>
                  <div className="text-green-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {asset.change}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Previsão</p>
                    <p className="text-white font-medium">{asset.prediction}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Preço Alvo</p>
                    <p className="text-white font-medium">{asset.target}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Análise Técnica</p>
                    <p className="text-white">{asset.analysis}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Confiança</span>
                      <span className="text-green-400">Alta</span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
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