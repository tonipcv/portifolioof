import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AssetsList from '@/components/AssetsList';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';

const MyPortfolio = dynamic(() => import('@/components/MyPortfolio'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-pulse space-y-8 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#161616] rounded-lg p-4 h-24" />
          ))}
        </div>
        <div className="h-[300px] bg-[#161616] rounded-lg" />
      </div>
    </div>
  ),
});

interface PageProps {
  params: {
    portfolioId: string;
  };
}

// Função para buscar cotação do dólar
async function getUSDToBRL() {
  try {
    const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
    const data = await response.json();
    return parseFloat(data.USDBRL.bid);
  } catch (error) {
    console.error('Error fetching USD to BRL rate:', error);
    return 5.00; // Valor fallback caso a API falhe
  }
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
  const portfolioId = params.portfolioId;
  const usdToBRL = await getUSDToBRL();

  const portfolio = await prisma.portfolio.findUnique({
    where: { id: portfolioId },
    include: { cryptos: true }
  });

  if (!portfolio) {
    notFound();
  }

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

      <div className="space-y-8">
        {/* Portfolio Chart */}
        <div className="bg-[#161616] rounded-lg border border-[#222222] overflow-hidden">
          <MyPortfolio portfolioId={portfolioId} />
        </div>

        {/* Assets List */}
        <div className="bg-[#161616] rounded-lg border border-[#222222] overflow-hidden">
          <AssetsList portfolioId={portfolioId} />
        </div>
      </div>
    </div>
  );
} 