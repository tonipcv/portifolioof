/*
  Warnings:

  - The primary key for the `Crypto` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `price` on the `Crypto` table. All the data in the column will be lost.
  - The primary key for the `Portfolio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `coinId` to the `Crypto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `investedValue` to the `Crypto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Crypto` table without a default value. This is not possible if the table is not empty.
  - Made the column `portfolioId` on table `Crypto` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Portfolio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Crypto" DROP CONSTRAINT "Crypto_portfolioId_fkey";

-- AlterTable
ALTER TABLE "Crypto" DROP CONSTRAINT "Crypto_pkey",
DROP COLUMN "price",
ADD COLUMN     "coinId" TEXT NOT NULL,
ADD COLUMN     "investedValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "portfolioId" SET NOT NULL,
ALTER COLUMN "portfolioId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Crypto_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Crypto_id_seq";

-- AlterTable
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_pkey",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Portfolio_id_seq";

-- CreateIndex
CREATE INDEX "Crypto_portfolioId_idx" ON "Crypto"("portfolioId");

-- CreateIndex
CREATE INDEX "Crypto_coinId_idx" ON "Crypto"("coinId");

-- AddForeignKey
ALTER TABLE "Crypto" ADD CONSTRAINT "Crypto_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
