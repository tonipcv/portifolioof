import { NextResponse, NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET handler
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const crypto = await prisma.crypto.findUnique({
      where: {
        id: parseInt(id)
      }
    })
    return NextResponse.json(crypto)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch crypto' }, { status: 500 })
  }
}

// DELETE handler
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const crypto = await prisma.crypto.delete({
      where: {
        id: parseInt(id)
      }
    })
    return NextResponse.json(crypto)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete crypto' }, { status: 500 })
  }
} 
