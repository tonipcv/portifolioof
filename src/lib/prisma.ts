import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

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
  