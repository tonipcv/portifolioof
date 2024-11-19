-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "plpgsql";

DO $$ 
BEGIN
    -- Verifica se a tabela "User" existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'User') THEN
        -- Adiciona as colunas se elas não existirem
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'stripeCustomerId') THEN
            ALTER TABLE "User" ADD COLUMN "stripeCustomerId" TEXT;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'subscriptionStatus') THEN
            ALTER TABLE "User" ADD COLUMN "subscriptionStatus" TEXT DEFAULT 'free';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'subscriptionId') THEN
            ALTER TABLE "User" ADD COLUMN "subscriptionId" TEXT;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'subscriptionEndDate') THEN
            ALTER TABLE "User" ADD COLUMN "subscriptionEndDate" TIMESTAMP(3);
        END IF;

        -- Adiciona a constraint única se não existir
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.table_constraints 
            WHERE constraint_name = 'User_stripeCustomerId_key'
        ) THEN
            ALTER TABLE "User" ADD CONSTRAINT "User_stripeCustomerId_key" UNIQUE ("stripeCustomerId");
        END IF;
    ELSE
        -- Se a tabela não existir, cria ela com todas as colunas necessárias
        CREATE TABLE "User" (
            "id" TEXT NOT NULL,
            "name" TEXT,
            "email" TEXT,
            "password" TEXT,
            "emailVerified" TIMESTAMP(3),
            "image" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            "resetToken" TEXT,
            "resetTokenExpiry" TIMESTAMP(3),
            "stripeCustomerId" TEXT,
            "subscriptionStatus" TEXT DEFAULT 'free',
            "subscriptionId" TEXT,
            "subscriptionEndDate" TIMESTAMP(3),
            CONSTRAINT "User_pkey" PRIMARY KEY ("id")
        );

        CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
        CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
    END IF;
END $$; 