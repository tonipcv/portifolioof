'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { TrendingUp, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Asset {
  name: string;
  price: string;
  change: string;
  prediction: string;
  target: string;
  analysis: string;
}

export default function RecommendedAssetsPage() {
  const { data: session } = useSession();
  const isPremium = session?.user?.subscriptionStatus === 'premium';
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('/api/ativos-recomendados');
        if (!response.ok) {
          throw new Error('Failed to fetch assets');
        }
        const data = await response.json();
        setAssets(data);
      } catch (error) {
        console.error('Error fetching assets:', error);
        setError('Failed to load assets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-700 rounded w-1/4"></div>
          <div className="h-96 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

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
          {assets.map((asset, index) => (
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