'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreatePortfolioModal } from './CreatePortfolioModal';

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
        Upgrade
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
          setError(data.error || 'Limite de portfólios atingido');
          return;
        }
        throw new Error(data.error || 'Erro ao criar portfólio');
      }

      router.push(`/portfolios/${data.id}`);
      
      setIsOpen(false);
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating portfolio:', error);
      setError(error instanceof Error ? error.message : 'Erro ao criar portfólio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-transparent hover:bg-white/5"
        size="icon"
        variant="ghost"
      >
        <Plus className="h-4 w-4 text-white" />
      </Button>

      <CreatePortfolioModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
} 