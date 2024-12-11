import { redirect } from 'next/navigation';

export default function CoursesPage() {
  return (
    <div className="md:pl-64 min-h-screen bg-white dark:bg-[#121214]">
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-white">Academy</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Exemplo de card de curso */}
            <div className="bg-white dark:bg-[#222222] rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
                  Curso de Trading
                </h2>
                <p className="text-zinc-600 dark:text-zinc-300 mb-4">
                  Aprenda estratégias avançadas de trading de criptomoedas
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Começar
                </button>
              </div>
            </div>

            {/* Mais exemplos de cards */}
            <div className="bg-white dark:bg-[#222222] rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
                  Análise Técnica
                </h2>
                <p className="text-zinc-600 dark:text-zinc-300 mb-4">
                  Domine as principais ferramentas de análise técnica
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Começar
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#222222] rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
                  Gestão de Risco
                </h2>
                <p className="text-zinc-600 dark:text-zinc-300 mb-4">
                  Aprenda a proteger seu capital e gerenciar riscos
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Começar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
