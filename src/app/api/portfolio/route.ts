import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: User not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    console.log('Creating portfolio with data:', {
      ...body,
      userId: session.user.id
    })

    const portfolio = await prisma.portfolio.create({
      data: {
        ...body,
        userId: session.user.id
      }
    })

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Error in POST /api/portfolio:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create portfolio' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: User not authenticated' },
        { status: 401 }
      )
    }

    const portfolios = await prisma.portfolio.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        cryptos: true
      }
    })

    return NextResponse.json(portfolios)
  } catch (error) {
    console.error('Error in GET /api/portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolios' },
      { status: 500 }
    )
  }
}