import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Adicionar campos de WhatsApp de forma segura
    await prisma.$executeRaw`
      DO $$ 
      BEGIN
        -- Adicionar coluna whatsapp se não existir
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'whatsapp') THEN
          ALTER TABLE "User" ADD COLUMN "whatsapp" TEXT;
          ALTER TABLE "User" ADD CONSTRAINT "User_whatsapp_key" UNIQUE ("whatsapp");
        END IF;

        -- Adicionar coluna whatsappVerified se não existir
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'whatsappVerified') THEN
          ALTER TABLE "User" ADD COLUMN "whatsappVerified" BOOLEAN NOT NULL DEFAULT false;
        END IF;

        -- Adicionar coluna verificationCode se não existir
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'verificationCode') THEN
          ALTER TABLE "User" ADD COLUMN "verificationCode" TEXT;
        END IF;

        -- Adicionar coluna verificationCodeExpiry se não existir
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'verificationCodeExpiry') THEN
          ALTER TABLE "User" ADD COLUMN "verificationCodeExpiry" TIMESTAMP(3);
        END IF;
      END $$;
    `

    console.log('Migração concluída com sucesso!')
  } catch (error) {
    console.error('Erro durante a migração:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 