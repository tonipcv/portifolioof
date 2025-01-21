import { Metadata } from 'next';
import AssetsList from '@/components/AssetsList';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Mercado | Crypto Portfolio',
  description: 'Acompanhe as cotações do mercado de criptomoedas',
};

export default function MarketPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-100">Mercado Cripto</h1>
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
        </div>
      }>
        <AssetsList />
      </Suspense>
    </main>
  );
} 