const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Criar um usuário padrão para portfolios existentes
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const defaultUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword
    }
  })

  // Atualizar todos os portfolios existentes para pertencerem ao usuário padrão
  await prisma.portfolio.updateMany({
    data: {
      userId: defaultUser.id
    }
  })

  console.log('Migração concluída!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 