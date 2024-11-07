import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import CreatePortfolioButton from '@/components/CreatePortfolioButton';
import { FolderPlus, TrendingUp, TrendingDown, Wallet2 } from 'lucide-react';
import DeletePortfolioButton from '@/components/DeletePortfolioButton';

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
    <div className="px-4 sm:px-6 lg:px-8 bg-[#111111]">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-white flex items-center">
            <Wallet2 className="w-8 h-8 mr-2 text-blue-400" />
            Meus Portfolios
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Gerencie seus investimentos em criptomoedas de forma organizada
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <CreatePortfolioButton />
        </div>
      </div>
      
      {portfolios.length === 0 ? (
        <div className="text-center mt-12 bg-[#161616] p-8 rounded-lg border border-[#222222]">
          <FolderPlus className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-white">Nenhum portfolio</h3>
          <p className="mt-1 text-sm text-gray-400">Comece criando seu primeiro portfolio.</p>
          <div className="mt-6">
            <CreatePortfolioButton />
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="relative">
              <DeletePortfolioButton portfolioId={portfolio.id} />
              <Link 
                href={`/portfolios/${portfolio.id}`}
                className="relative group block overflow-hidden rounded-lg bg-[#161616] border border-[#222222] p-6 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {portfolio.name}
                  </h3>
                  <span className="inline-flex items-center rounded-md bg-[#222222] px-2 py-1 text-xs font-medium text-gray-300">
                    {portfolio.cryptos.length} ativos
                  </span>
                </div>
                {portfolio.description && (
                  <p className="mt-2 text-sm text-gray-400 line-clamp-2">{portfolio.description}</p>
                )}
                <div className="mt-4 border-t border-[#222222] pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total:</span>
                    <span className="font-medium text-blue-400">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(portfolio.totalValue * 5)}
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between text-sm items-center">
                    <span className="text-gray-400">Lucro:</span>
                    <span className={`font-medium flex items-center ${portfolio.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {portfolio.totalProfit >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(portfolio.totalProfit * 5)}
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 group-hover:ring-blue-500/20"></div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 