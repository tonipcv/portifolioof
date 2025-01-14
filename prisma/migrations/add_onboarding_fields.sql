-- AlterTable
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "cryptoLevel" TEXT,
ADD COLUMN IF NOT EXISTS "exchange" TEXT,
ADD COLUMN IF NOT EXISTS "traditionalInvestment" TEXT,
ADD COLUMN IF NOT EXISTS "cryptoInvestment" TEXT,
ADD COLUMN IF NOT EXISTS "discoverySource" TEXT,
ADD COLUMN IF NOT EXISTS "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false; 