'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export function CreatePortfolioButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch('/api/portfolio');
        if (response.ok) {
          const portfolios = await response.json();
          setPortfolioCount(portfolios.length);
        }
      } catch (error) {
        console.error('Erro ao buscar portfólios:', error);
      }
    };

    if (session) {
      fetchPortfolios();
    }
  }, [session]);

  const isPremium = session?.user?.subscriptionStatus === 'premium';
  const showUpgradeButton = !isPremium && portfolioCount >= 1;

  if (showUpgradeButton) {
    return (
      <Link
        href="/pricing"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-transparent border border-white/20 rounded-md hover:bg-white/5 transition-colors"
      >
        Fazer Upgrade
      </Link>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setError(data.message || 'Limite de portfólios atingido');
          return;
        }
        throw new Error(data.error || 'Erro ao criar portfólio');
      }

      router.push(`/portfolios/${data.id}`);
      
      setIsOpen(false);
      setName('');
      setDescription('');
    } catch (error) {
      setError('Erro ao criar portfólio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center w-8 h-8 bg-transparent border border-white/20 rounded-md hover:bg-white/5 transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#222222] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Criar Novo Portfólio</h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="text-red-500 text-sm">{error}</p>
                {!isPremium && (
                  <Link 
                    href="/pricing" 
                    className="text-blue-400 hover:text-blue-300 text-sm mt-2 block"
                  >
                    Fazer upgrade para Premium →
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Nome do Portfólio
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-[#333333] rounded border border-[#444444] focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 bg-[#333333] rounded border border-[#444444] focus:outline-none focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 