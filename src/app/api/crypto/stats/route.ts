import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Iniciando busca de estatísticas...')
    
    // Busca todas as cryptos diretamente
    const cryptos = await prisma.crypto.findMany()
    console.log('Cryptos encontradas:', cryptos.length)
    
    // Calcula as estatísticas
    const stats = {
      totalValue: cryptos.reduce((acc, crypto) => acc + (crypto.amount * crypto.currentPrice), 0),
      totalCryptos: cryptos.length,
      totalProfit: cryptos.reduce((acc, crypto) => 
        acc + (crypto.amount * (crypto.currentPrice - crypto.buyPrice)), 0
      )
    }
    
    console.log('Estatísticas calculadas:', stats)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erro detalhado:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    
    return NextResponse.json({
      totalValue: 0,
      totalCryptos: 0,
      totalProfit: 0
    }, { status: 500 })
  }
}