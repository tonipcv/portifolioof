import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AssetsList from '@/components/AssetsList';
import Link from 'next/link';
import { ArrowLeft, Wallet2, TrendingUp, TrendingDown } from 'lucide-react';

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
  
  // Calcula o valor total investido somando o investedValue de todas as criptos
  const totalInvestedAmount = portfolio.cryptos.reduce((total, crypto) => {
    return total + crypto.investedValue;
  }, 0);
  
  const investedAmountBRL = totalInvestedAmount * usdToBRL;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/portfolios"
          className="text-gray-400 hover:text-blue-400 transition-colors mb-4 inline-flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Portfolios
        </Link>
        
        <div className="flex justify-between items-center mt-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <h1 className="w-8 h-8 mr-2 text-blue-400" />
              {portfolio.name}
            </h1>
            {portfolio.description && (
              <p className="text-gray-400 mt-1">{portfolio.description}</p>
            )}
          </div>
          <div className="text-right">
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
              <span className={`font-medium flex items-center ${totalProfitBRL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalProfitBRL >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
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