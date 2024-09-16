/*
  Warnings:

  - A unique constraint covering the columns `[transactionHash]` on the table `CryptoAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CryptoAddress" ADD COLUMN     "transactionHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAddress_transactionHash_key" ON "CryptoAddress"("transactionHash");
