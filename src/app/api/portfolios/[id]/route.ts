import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Primeiro deletamos todas as criptomoedas associadas ao portfólio
    await prisma.crypto.deleteMany({
      where: {
        portfolioId: params.id,
      },
    })

    // Depois deletamos o portfólio
    await prisma.portfolio.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Portfolio deleted successfully' })
  } catch (error) {
    console.error('Error deleting portfolio:', error)
    return NextResponse.json(
      { error: 'Error deleting portfolio' },
      { status: 500 }
    )
  }
} 