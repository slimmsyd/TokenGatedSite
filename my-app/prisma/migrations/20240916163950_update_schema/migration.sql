/*
  Warnings:

  - Made the column `transactionHash` on table `CryptoAddress` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CryptoAddress" ALTER COLUMN "transactionHash" SET NOT NULL;
