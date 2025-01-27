import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

// Função para buscar histórico de preços de uma criptomoeda
async function getCryptoHistory(coinId: string, days: number) {
  try {
    const response = await fetch(
      `https://pro-api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${days <= 1 ? 'minute' : 'daily'}`,
      {
        headers: {
          'accept': 'application/json',
          'x-cg-pro-api-key': 'CG-hpbLQhyhxzcJJyUkjQdBjkPc'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch history for ${coinId}`);
    }
    
    const data = await response.json();
    return data.prices as [number, number][]; // [timestamp, price]
  } catch (error) {
    console.error(`Error fetching history for ${coinId}:`, error);
    return [];
  }
}

export async function GET(
  request: Request,
  { params }: { params: { portfolioId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '1w';

    // Buscar o portfólio e suas criptomoedas
    const portfolio = await prisma.portfolio.findUnique({
      where: { 
        id: params.portfolioId,
        userId: session.user.id
      },
      include: { cryptos: true }
    });

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    // Buscar cotação do dólar
    const usdToBRL = await getUSDToBRL();

    // Calcular valores atuais
    const totalInvested = portfolio.cryptos.reduce((sum, crypto) => sum + crypto.investedValue, 0);
    const currentValue = portfolio.cryptos.reduce((sum, crypto) => sum + (crypto.currentPrice * crypto.amount), 0);
    const totalProfit = currentValue - totalInvested;

    if (portfolio.cryptos.length === 0) {
      return NextResponse.json({
        labels: [],
        values: [],
        invested: [],
        profits: [],
        percentageChange: 0,
        currentValue: 0,
        totalInvested: 0,
        totalProfit: 0
      });
    }

    // Determinar o número de dias baseado no período
    let days = 7;
    switch (period) {
      case '1d':
        days = 1;
        break;
      case '1w':
        days = 7;
        break;
      case '1m':
        days = 30;
        break;
      case '1y':
        days = 365;
        break;
      case 'all':
        days = 1825; // 5 anos
        break;
    }

    // Buscar histórico de preços para cada criptomoeda
    const historiesPromises = portfolio.cryptos.map(async crypto => {
      const history = await getCryptoHistory(crypto.coinId, days);
      return {
        coinId: crypto.coinId,
        amount: crypto.amount,
        investedValue: crypto.investedValue,
        history: history.filter(([_, price]) => price > 0) // Remover pontos com preço zero
      };
    });

    const histories = await Promise.all(historiesPromises);
    
    // Combinar históricos e calcular valor total do portfólio em cada ponto
    const timePoints = new Map<number, { value: number, invested: number }>();

    // Inicializar todos os pontos no tempo
    histories.forEach(({ history }) => {
      history.forEach(([timestamp]) => {
        if (!timePoints.has(timestamp)) {
          timePoints.set(timestamp, { value: 0, invested: totalInvested });
        }
      });
    });

    // Calcular o valor em cada ponto no tempo
    histories.forEach(({ history, amount }) => {
      history.forEach(([timestamp, price]) => {
        const point = timePoints.get(timestamp)!;
        point.value += price * amount;
      });
    });

    // Converter para array e ordenar por timestamp
    const dataPoints = Array.from(timePoints.entries())
      .sort(([a], [b]) => a - b)
      .map(([timestamp, { value, invested }]) => ({
        timestamp,
        value: Number((value * usdToBRL).toFixed(2)), // Converter para BRL e arredondar
        invested: Number((invested * usdToBRL).toFixed(2)),
        profit: Number(((value - invested) * usdToBRL).toFixed(2))
      }))
      .filter(point => point.value > 0); // Remover pontos com valor zero

    // Se não temos dados históricos suficientes, usar valores atuais
    if (dataPoints.length === 0) {
      const now = Date.now();
      dataPoints.push({
        timestamp: now,
        value: Number((currentValue * usdToBRL).toFixed(2)),
        invested: Number((totalInvested * usdToBRL).toFixed(2)),
        profit: Number((totalProfit * usdToBRL).toFixed(2))
      });
    }

    // Calcular variação percentual
    const firstPoint = dataPoints[0];
    const lastPoint = dataPoints[dataPoints.length - 1];
    const percentageChange = firstPoint.value > 0 
      ? ((lastPoint.value - firstPoint.value) / firstPoint.value) * 100 
      : 0;

    return NextResponse.json({
      labels: dataPoints.map(point => new Date(point.timestamp).toLocaleString()),
      values: dataPoints.map(point => point.value),
      invested: dataPoints.map(point => point.invested),
      profits: dataPoints.map(point => point.profit),
      percentageChange: Number(percentageChange.toFixed(2)),
      currentValue: Number((currentValue * usdToBRL).toFixed(2)),
      totalInvested: Number((totalInvested * usdToBRL).toFixed(2)),
      totalProfit: Number((totalProfit * usdToBRL).toFixed(2))
    });
  } catch (error) {
    console.error('Error generating portfolio history:', error);
    return NextResponse.json(
      { error: 'Failed to generate portfolio history' },
      { status: 500 }
    );
  }
} 