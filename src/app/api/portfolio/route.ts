import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: 1 },
      include: {
        cryptos: true
      }
    })

    if (!portfolio) {
      return NextResponse.json([])
    }

    // Atualiza os preços atuais das criptomoedas
    const updatedCryptos = await Promise.all(
      portfolio.cryptos.map(async (crypto) => {
        try {
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${crypto.name.toLowerCase()}&vs_currencies=usd`
          )
          const data = await response.json()
          const currentPrice = data[crypto.name.toLowerCase()]?.usd || crypto.currentPrice
          
          // Atualiza o preço no banco de dados
          await prisma.crypto.update({
            where: { id: crypto.id },
            data: { currentPrice }
          })

          return { ...crypto, currentPrice }
        } catch (error) {
          console.error(`Error updating price for ${crypto.name}:`, error)
          return crypto
        }
      })
    )

    return NextResponse.json(updatedCryptos)
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
} 