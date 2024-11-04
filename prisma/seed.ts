import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Cria um portfolio padrão se não existir
  const portfolio = await prisma.portfolio.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Portfolio Principal'
    },
  })
  
  console.log({ portfolio })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 