import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Adiciona handler de erro para conexão
prisma.$connect()
  .then(() => {
    console.log('Successfully connected to database')
  })
  .catch((e) => {
    console.error('Error connecting to database:', e)
    process.exit(1)
  })
  