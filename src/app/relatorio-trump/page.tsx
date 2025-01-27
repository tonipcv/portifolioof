'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Montserrat } from 'next/font/google';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const montserrat = Montserrat({ subsets: ['latin'] });

const solanaData = [
  { date: 'Jan', price: 3 },
  { date: 'Mar', price: 15 },
  { date: 'Mai', price: 45 },
  { date: 'Jul', price: 120 },
  { date: 'Set', price: 180 },
  { date: 'Nov', price: 250 },
];

const polygonData = [
  { date: 'Jan', price: 0.5 },
  { date: 'Mar', price: 0.8 },
  { date: 'Mai', price: 1.2 },
  { date: 'Jul', price: 1.6 },
  { date: 'Set', price: 2.0 },
  { date: 'Nov', price: 2.5 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-800 p-2 rounded border border-zinc-700 text-sm">
        <p className="text-zinc-300">{label}</p>
        <p className="text-green-400 font-bold">US$ {payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export default function ReportPage() {
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const router = useRouter();

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubscribe = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    const checkoutUrl = selectedPlan === 'annual' 
      ? 'https://checkout.k17.com.br/subscribe/anual-cryph'
      : 'https://checkout.k17.com.br/subscribe/semestral-cryph';
    
    window.location.href = checkoutUrl;
  };

  return (
    <div className={`min-h-screen bg-[#121214] ${montserrat.className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-transparent" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="relative max-w-4xl mx-auto px-4 py-8 sm:py-16">
          {/* Premium Access Banner */}
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-zinc-700/50 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="text-zinc-200 text-xl sm:text-2xl">🔒</div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-200">
                    Informação Importante para Novos Membros
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Esta página está bloqueada para o Acesso Premium
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/50 px-3 py-2 rounded-lg border border-zinc-700/50">
                <span className="text-zinc-400 text-sm">Tempo restante:</span>
                <span className="text-zinc-200 font-mono font-bold">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Article Header with Dynamic Background */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 p-4 sm:p-8 mb-8 sm:mb-12 border border-zinc-700/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[url('/crypto-pattern.svg')] opacity-5" />
            <h1 className="relative text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-white mb-2 sm:mb-4 leading-tight">
              Como a possível reeleição de Trump pode impactar o mercado de criptomoedas
            </h1>
            <h2 className="relative text-lg sm:text-2xl font-bold text-zinc-100">
              Você está preparado para capturar essas valorizações?
            </h2>
          </div>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none">
            {/* Market Overview Section */}
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl p-4 sm:p-8 mb-8 sm:mb-12 border border-zinc-700/50">
              <p className="text-base sm:text-lg text-zinc-300 mb-6">
                O mercado de criptomoedas é conhecido por ser altamente volátil e cheio de oportunidades – mas também de riscos. Nos últimos dois anos, moedas como Solana saltaram de US$3 para US$250, e Polygon cresceu mais de 400%.
              </p>

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-zinc-800/50 rounded-lg p-4 sm:p-6 border border-zinc-700/50">
                  <div className="text-xl sm:text-2xl font-bold text-green-400 mb-2">Solana (SOL)</div>
                  <div className="text-sm sm:text-base text-zinc-400 mb-4">Valorização de +1,300%</div>
                  <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={solanaData}>
                        <defs>
                          <linearGradient id="colorSol" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#71717a" />
                        <YAxis stroke="#71717a" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="price" stroke="#4ade80" fillOpacity={1} fill="url(#colorSol)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg backdrop-blur-sm">
                    <div className="text-xs sm:text-sm text-zinc-500 mb-1">Se você tivesse investido</div>
                    <div className="text-base sm:text-xl text-zinc-300 mb-1">R$ 1.000</div>
                    <div className="text-xs sm:text-sm text-zinc-500 mb-2">Hoje teria</div>
                    <div className="text-xl sm:text-2xl font-bold text-green-400">R$ 14.000</div>
                  </div>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4 sm:p-6 border border-zinc-700/50">
                  <div className="text-xl sm:text-2xl font-bold text-green-400 mb-2">Polygon (MATIC)</div>
                  <div className="text-sm sm:text-base text-zinc-400 mb-4">Crescimento de +400%</div>
                  <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={polygonData}>
                        <defs>
                          <linearGradient id="colorPoly" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#71717a" />
                        <YAxis stroke="#71717a" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="price" stroke="#4ade80" fillOpacity={1} fill="url(#colorPoly)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg backdrop-blur-sm">
                    <div className="text-xs sm:text-sm text-zinc-500 mb-1">Se você tivesse investido</div>
                    <div className="text-base sm:text-xl text-zinc-300 mb-1">R$ 1.000</div>
                    <div className="text-xs sm:text-sm text-zinc-500 mb-2">Hoje teria</div>
                    <div className="text-xl sm:text-2xl font-bold text-green-400">R$ 5.000</div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-4 sm:p-6 border border-zinc-700/50">
                <div className="text-xl sm:text-2xl font-bold text-green-400 mb-2">+1,000%</div>
                <div className="text-sm sm:text-base text-zinc-400 mb-4">Valorização média de tokens durante bull markets</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-zinc-900/50 rounded-lg backdrop-blur-sm">
                    <div className="text-xs sm:text-sm text-zinc-500 mb-1">Investimento inicial</div>
                    <div className="text-base sm:text-xl text-zinc-300">R$ 1.000</div>
                  </div>
                  <div className="hidden md:flex p-4 bg-zinc-900/50 rounded-lg backdrop-blur-sm items-center justify-center">
                    <div className="text-xl sm:text-2xl text-zinc-600">→</div>
                  </div>
                  <div className="p-4 bg-zinc-900/50 rounded-lg backdrop-blur-sm">
                    <div className="text-xs sm:text-sm text-zinc-500 mb-1">Potencial retorno</div>
                    <div className="text-xl sm:text-2xl font-bold text-green-400">R$ 11.000</div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-base sm:text-lg text-zinc-300 mb-6">
              Enquanto alguns investidores capturaram esses retornos históricos, a maioria ficou de fora, ou pior: investiu tarde e sofreu prejuízos.
            </p>
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <p className="text-lg sm:text-xl font-bold text-zinc-100 mb-2">
                A razão?
              </p>
              <p className="text-sm sm:text-base text-zinc-300">
                Falta de informações técnicas precisas e ferramentas de análise avançadas.
              </p>
            </div>

            {/* Hidden Costs Section */}
            <div className="relative bg-zinc-900/80 backdrop-blur-sm rounded-xl p-4 sm:p-8 mb-8 sm:mb-12 border border-zinc-700/50">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                Os custos ocultos de operar no mercado sem informações técnicas adequadas
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center bg-zinc-800/50 rounded-lg p-3 sm:p-4 border border-zinc-700/50">
                  <div className="text-red-400 text-xl sm:text-2xl mr-3 sm:mr-4">⚠️</div>
                  <p className="text-sm sm:text-base text-zinc-300">Você perde as grandes oportunidades, como projetos que crescem mais de 500% em semanas.</p>
                </div>
                <div className="flex items-center bg-zinc-800/50 rounded-lg p-3 sm:p-4 border border-zinc-700/50">
                  <div className="text-red-400 text-xl sm:text-2xl mr-3 sm:mr-4">⚠️</div>
                  <p className="text-sm sm:text-base text-zinc-300">Investe em projetos aparentemente promissores que acabam desvalorizando 70% ou mais.</p>
                </div>
                <div className="flex items-center bg-zinc-800/50 rounded-lg p-3 sm:p-4 border border-zinc-700/50">
                  <div className="text-red-400 text-xl sm:text-2xl mr-3 sm:mr-4">⚠️</div>
                  <p className="text-sm sm:text-base text-zinc-300">Não sabe o momento certo de sair e proteger seus lucros.</p>
                </div>
              </div>
            </div>

            {/* Solution Section */}
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl p-4 sm:p-8 mb-8 sm:mb-12 border border-zinc-700/50">
              <h2 className="text-xl sm:text-2xl font-bold text-green-400 mb-4 sm:mb-6">
                CRYPH.ai: Sua vantagem técnica em um mercado imprevisível
              </h2>
              <p className="text-sm sm:text-lg text-zinc-300 mb-4 sm:mb-6">
                O CRYPH.ai foi desenvolvido para resolver exatamente esses problemas.
              </p>
              <p className="text-sm sm:text-lg text-zinc-300 mb-6 sm:mb-8">
                Ele combina análises técnicas detalhadas, inteligência artificial exclusiva e acesso a relatórios personalizados, para que você tome decisões baseadas em dados – não em suposições.
              </p>
            </div>

            {/* Features Section */}
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl p-4 sm:p-8 mb-8 sm:mb-12 border border-zinc-700/50">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">
                Decisões informadas, resultados estratégicos: veja o que você terá acesso
              </h2>
              <div className="grid gap-4 sm:gap-6">
                <div className="group bg-zinc-800/50 rounded-lg p-4 sm:p-6 transform hover:scale-[1.02] transition-all border border-zinc-700/50 hover:border-green-500/20">
                  <div className="flex items-start">
                    <span className="text-green-400 text-lg sm:text-xl mr-3 sm:mr-4">📊</span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-zinc-100 mb-1 sm:mb-2 group-hover:text-green-400 transition-colors">Relatórios técnicos exclusivos</h3>
                      <p className="text-sm sm:text-base text-zinc-300">Identifique as criptomoedas mais promissoras antes do mercado.</p>
                    </div>
                  </div>
                </div>
                <div className="group bg-zinc-800/50 rounded-lg p-4 sm:p-6 transform hover:scale-[1.02] transition-all border border-zinc-700/50 hover:border-green-500/20">
                  <div className="flex items-start">
                    <span className="text-green-400 text-lg sm:text-xl mr-3 sm:mr-4">🤖</span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-zinc-100 mb-1 sm:mb-2 group-hover:text-green-400 transition-colors">Análise de carteira com IA</h3>
                      <p className="text-sm sm:text-base text-zinc-300">Avalie sua exposição ao risco, identifique pontos fracos e otimize seus investimentos.</p>
                    </div>
                  </div>
                </div>
                <div className="group bg-zinc-800/50 rounded-lg p-4 sm:p-6 transform hover:scale-[1.02] transition-all border border-zinc-700/50 hover:border-green-500/20">
                  <div className="flex items-start">
                    <span className="text-green-400 text-lg sm:text-xl mr-3 sm:mr-4">⚡</span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-zinc-100 mb-1 sm:mb-2 group-hover:text-green-400 transition-colors">Alertas estratégicos</h3>
                      <p className="text-sm sm:text-base text-zinc-300">Saiba o momento certo para entrar ou sair de um ativo, baseado em dados e tendências reais.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl p-4 sm:p-8 mb-8 sm:mb-12 border border-zinc-700/50">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                Investidores que confiam em dados estão capturando os melhores resultados
              </h2>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                <div className="bg-zinc-800/50 rounded-lg p-4 sm:p-6 border border-zinc-700/50">
                  <div className="text-2xl sm:text-4xl font-bold text-green-400 mb-3 sm:mb-4">+1,300%</div>
                  <p className="text-sm sm:text-base text-zinc-300">Um de nossos usuários identificou o movimento de APTOS (APT), capturando a maior parte do lucro em menos de um ano.</p>
                  <div className="mt-4 p-3 sm:p-4 bg-zinc-900/50 rounded-lg backdrop-blur-sm">
                    <div className="text-xs sm:text-sm text-zinc-500">Investimento inicial: R$ 5.000</div>
                    <div className="text-lg sm:text-xl font-bold text-green-400 mt-2">Retorno: R$ 70.000</div>
                  </div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4 sm:p-6 border border-zinc-700/50">
                  <div className="text-2xl sm:text-4xl font-bold text-green-400 mb-3 sm:mb-4">$5,000</div>
                  <p className="text-sm sm:text-base text-zinc-300">Outro evitou um prejuízo ao receber um alerta para sair de uma moeda antes de uma queda de 40%.</p>
                  <div className="mt-4 p-3 sm:p-4 bg-zinc-900/50 rounded-lg backdrop-blur-sm">
                    <div className="text-xs sm:text-sm text-zinc-500">Prejuízo evitado</div>
                    <div className="text-lg sm:text-xl font-bold text-green-400 mt-2">Economia: R$ 5.000</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-800 backdrop-blur-sm rounded-xl p-4 sm:p-8 mb-8 sm:mb-12 border border-zinc-700/50">
              <div className="flex flex-col items-center text-center mb-6">
                {session?.user?.name && (
                  <div className="text-zinc-200 font-medium mb-2">
                    Oferta exclusiva para <span className="text-green-400">{session.user.name}</span>
                  </div>
                )}
                <div className="bg-zinc-800/50 px-4 py-2 rounded-lg border border-zinc-700/50 mb-4">
                  <div className="text-zinc-200 text-sm mb-1">Essa oferta expira em:</div>
                  <div className="text-green-400 font-mono font-bold text-xl">
                    {formatTime(timeLeft)}
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-200">
                  Por menos do que o custo de um erro, garanta seu acesso ao CRYPH.ai
                </h2>
              </div>
              
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-6 sm:mb-8">
                <button
                  onClick={() => setSelectedPlan('annual')}
                  className={`relative p-4 sm:p-6 rounded-xl transition-all transform hover:scale-[1.02] ${
                    selectedPlan === 'annual'
                      ? 'bg-gradient-to-b from-zinc-800 to-zinc-900 border-green-500/30'
                      : 'bg-zinc-800/50 border-zinc-700/50'
                  } border`}
                >
                  <div className="text-lg sm:text-xl font-bold text-zinc-200 mb-2">Anual</div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">
                    R$197<span className="text-base sm:text-lg text-zinc-400">/mês</span>
                  </div>
                  {selectedPlan === 'annual' && (
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-green-500/20 text-green-400 text-xs px-2 sm:px-3 py-1 rounded-full">
                      52% OFF
                    </div>
                  )}
                  {timeLeft > 0 && (
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                      Preço aumentará em {formatTime(timeLeft)}
                    </div>
                  )}
                </button>
                <button
                  onClick={() => setSelectedPlan('semiannual')}
                  className={`relative p-4 sm:p-6 rounded-xl transition-all transform hover:scale-[1.02] ${
                    selectedPlan === 'semiannual'
                      ? 'bg-gradient-to-b from-zinc-800 to-zinc-900 border-green-500/30'
                      : 'bg-zinc-800/50 border-zinc-700/50'
                  } border`}
                >
                  <div className="text-lg sm:text-xl font-bold text-zinc-200 mb-2">Semestral</div>
                  <div className="text-2xl sm:text-3xl font-bold text-zinc-200 mb-2">
                    R$400<span className="text-base sm:text-lg text-zinc-400">/mês</span>
                  </div>
                </button>
              </div>

              <button
                onClick={handleSubscribe}
                className="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-base sm:text-lg font-bold transition-all transform hover:scale-[1.02] mb-3 sm:mb-4 shadow-lg shadow-green-500/20"
              >
                {session ? 'Fazer Upgrade Agora' : 'Fazer Login para Assinar'}
              </button>

              <p className="text-sm sm:text-base text-zinc-400 text-center">
                O custo de investir no escuro é muito maior do que isso.
              </p>
            </div>

            {/* Final CTA Section */}
            <div className="text-center bg-zinc-900/80 backdrop-blur-sm rounded-xl p-4 sm:p-8 border border-zinc-700/50">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                Resultados consistentes começam com decisões informadas
              </h2>
              <p className="text-sm sm:text-lg text-zinc-300 mb-4 sm:mb-6">
                O mercado de criptomoedas não espera, e os melhores retornos vão para quem está preparado.
              </p>
              <p className="text-sm sm:text-lg text-zinc-300 mb-6 sm:mb-8">
                O CRYPH.ai entrega as ferramentas e informações certas para que você aproveite o que há de melhor no mercado, sem depender de sorte ou especulação.
              </p>
              <p className="text-lg sm:text-xl font-bold text-white">
                Não deixe as melhores oportunidades passarem novamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 