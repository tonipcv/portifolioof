import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AssetsList from '@/components/AssetsList';
import Link from 'next/link';

interface PageProps {
  params: {
    id: string;
  };
}

// Função para formatar valores em BRL
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

  // Taxa de conversão USD para BRL (você pode buscar isso de uma API de câmbio)
  const usdToBRL = 5.00; // Valor fixo para exemplo, idealmente buscar de uma API

  // Converter valores para BRL
  const totalValueBRL = portfolio.totalValue * usdToBRL;
  const totalProfitBRL = portfolio.totalProfit * usdToBRL;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/portfolios"
          className="text-gray-400 hover:text-green-400 transition-colors mb-4 inline-block"
        >
          ← Voltar para Portfolios
        </Link>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{portfolio.name}</h1>
            {portfolio.description && (
              <p className="text-gray-400 mt-1">{portfolio.description}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-gray-400">
              Total: <span className="text-green-400">{formatBRL(totalValueBRL)}</span>
            </p>
            <p className={totalProfitBRL >= 0 ? 'text-green-400' : 'text-red-400'}>
              Lucro: {formatBRL(totalProfitBRL)}
            </p>
          </div>
        </div>
      </div>

      <AssetsList portfolioId={portfolioId} />
    </div>
  );
} 