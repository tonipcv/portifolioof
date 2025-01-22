import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  const isPremium = session?.user?.subscriptionStatus === 'premium'

  if (!session) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    )
  }

  if (!isPremium) {
    return new NextResponse(
      JSON.stringify({ error: 'Premium subscription required' }),
      { status: 403 }
    )
  }

  const recommendedAssets = [
    {
      name: 'Bitcoin (BTC)',
      price: '$43,567.89',
      change: '+5.67%',
      prediction: 'Forte tendência de alta',
      target: '$48,000',
      analysis: 'Suporte em $42k, resistência em $45k. Momento técnico favorável.',
    },
    {
      name: 'Ethereum (ETH)',
      price: '$2,345.67',
      change: '+3.45%',
      prediction: 'Acumulação',
      target: '$2,800',
      analysis: 'Formação de bandeira bullish no gráfico diário.',
    },
    {
      name: 'Solana (SOL)',
      price: '$98.76',
      change: '+8.90%',
      prediction: 'Compra',
      target: '$120',
      analysis: 'Rompimento de resistência importante com volume.',
    },
    {
      name: 'Cardano (ADA)',
      price: '$0.58',
      change: '+4.20%',
      prediction: 'Acumulação',
      target: '$0.75',
      analysis: 'Formação de suporte forte em $0.55, volume crescente.',
    },
    {
      name: 'Polkadot (DOT)',
      price: '$7.89',
      change: '+6.15%',
      prediction: 'Compra',
      target: '$9.50',
      analysis: 'Padrão de reversão formado, momentum positivo.',
    },
    {
      name: 'Chainlink (LINK)',
      price: '$15.34',
      change: '+7.80%',
      prediction: 'Forte tendência de alta',
      target: '$18.00',
      analysis: 'Quebra de resistência com alto volume, tendência de alta confirmada.',
    }
  ]

  return NextResponse.json(recommendedAssets)
} 