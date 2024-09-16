-- DropIndex
DROP INDEX "CryptoAddress_transactionHash_key";

-- AlterTable
ALTER TABLE "CryptoAddress" ALTER COLUMN "transactionHash" DROP NOT NULL;
