import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AssetsList from '@/components/AssetsList';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';

interface PageProps {
  params: {
    id: string;
  };
}

const formatBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export default async function PortfolioPage({ params }: PageProps) {
  const portfolioId = params.id;

  const portfolio = await prisma.portfolio.findUnique({
    where: { id: portfolioId },
    include: { cryptos: true }
  });

  if (!portfolio) {
    notFound();
  }

  const usdToBRL = 5.00;
  const totalValueBRL = portfolio.totalValue * usdToBRL;
  const totalProfitBRL = portfolio.totalProfit * usdToBRL;
  const investedAmountBRL = portfolio.cryptos.reduce((total, crypto) => total + crypto.investedValue, 0) * usdToBRL;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <Link 
            href="/portfolios"
            className="text-gray-400 hover:text-blue-400 transition-colors inline-flex items-center"
          >
            <ArrowLeft className="w-6 h-6 sm:mr-2" />
            <span className="hidden sm:inline">Voltar para Portfolios</span>
          </Link>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {portfolio.name}
            </h1>
            {portfolio.description && (
              <p className="text-gray-400 mt-1">{portfolio.description}</p>
            )}
          </div>

          {/* Versão Mobile - Informações em Cards */}
          <div className="w-full sm:hidden mt-4 grid gap-4">
            <div className={`p-4 rounded-lg ${totalProfitBRL >= 0 ? 'bg-green-900/20 border border-green-800' : 'bg-red-900/20 border border-red-800'}`}>
              <p className="text-sm text-gray-400">Lucro/Prejuízo</p>
              <p className={`text-xl font-bold ${totalProfitBRL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatBRL(totalProfitBRL)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#161616] border border-[#222222]">
                <p className="text-sm text-gray-400">Saldo Total</p>
                <p className="text-lg font-semibold text-blue-400">{formatBRL(totalValueBRL)}</p>
              </div>
              <div className="p-4 rounded-lg bg-[#161616] border border-[#222222]">
                <p className="text-sm text-gray-400">Investido</p>
                <p className="text-lg font-semibold text-gray-200">{formatBRL(investedAmountBRL)}</p>
              </div>
            </div>
          </div>

          {/* Versão Desktop - Informações em linha */}
          <div className="hidden sm:block text-right">
            <div className="flex items-center justify-end mb-2">
              <span className="text-gray-400 mr-2">Saldo Total:</span>
              <span className="text-blue-400 font-medium">{formatBRL(totalValueBRL)}</span>
            </div>
            <div className="flex items-center justify-end mb-2">
              <span className="text-gray-400 mr-2">Investido:</span>
              <span className="text-gray-400 font-medium">{formatBRL(investedAmountBRL)}</span>
            </div>
            <div className="flex items-center justify-end">
              <span className="text-gray-400 mr-2">Lucro:</span>
              <span className={`font-medium ${totalProfitBRL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatBRL(totalProfitBRL)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AssetsList portfolioId={portfolioId} />
    </div>
  );
} 