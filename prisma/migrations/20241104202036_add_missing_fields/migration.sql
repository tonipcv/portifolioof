/*
  Warnings:

  - Made the column `currentPrice` on table `Crypto` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Crypto_coinId_idx";

-- DropIndex
DROP INDEX "Crypto_portfolioId_idx";

-- AlterTable
ALTER TABLE "Crypto" ADD COLUMN     "profit" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "currentPrice" SET NOT NULL,
ALTER COLUMN "currentPrice" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "totalProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalValue" DOUBLE PRECISION NOT NULL DEFAULT 0;
