-- AlterTable
ALTER TABLE "User" 
ADD COLUMN "stripeCustomerId" TEXT UNIQUE,
ADD COLUMN "subscriptionStatus" TEXT DEFAULT 'free',
ADD COLUMN "subscriptionId" TEXT,
ADD COLUMN "subscriptionEndDate" TIMESTAMP(3); 