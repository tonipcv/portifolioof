import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import CreatePortfolioButton from '@/components/CreatePortfolioButton';

export const metadata: Metadata = {
  title: 'Portfolios | Crypto Tracker',
  description: 'Gerencie seus portfolios de criptomoedas',
};

export default async function PortfoliosPage() {
  const portfolios = await prisma.portfolio.findMany({
    include: {
      cryptos: true,
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Meus Portfolios</h1>
        <CreatePortfolioButton />
      </div>
      
      {portfolios.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
          <h3 className="text-xl text-gray-400 mb-4">Nenhum portfolio encontrado</h3>
          <p className="text-gray-500 mb-6">Comece criando seu primeiro portfolio</p>
          <CreatePortfolioButton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <Link 
              href={`/portfolios/${portfolio.id}`}
              key={portfolio.id}
              className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800 hover:border-green-500/50 transition-all"
            >
              <h2 className="text-xl font-semibold mb-2 text-white">
                {portfolio.name}
              </h2>
              {portfolio.description && (
                <p className="text-gray-400 mb-4">{portfolio.description}</p>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">
                  Ativos: {portfolio.cryptos.length}
                </span>
                <span className="text-green-400">
                  Total: ${portfolio.totalValue.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 text-sm">
                <span className={`${
                  portfolio.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  Lucro: ${portfolio.totalProfit.toLocaleString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 