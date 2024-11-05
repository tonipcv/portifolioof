import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

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
      <h1 className="text-2xl font-bold mb-6">Meus Portfolios</h1>
      
      {portfolios.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum portfolio encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <div 
              key={portfolio.id} 
              className="bg-gray-900 rounded-lg shadow-lg p-6"
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 