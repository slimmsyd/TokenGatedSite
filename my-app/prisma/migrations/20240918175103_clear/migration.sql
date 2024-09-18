-- AlterTable
ALTER TABLE "CryptoAddress" ADD COLUMN     "questionsAsked" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "link" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);
