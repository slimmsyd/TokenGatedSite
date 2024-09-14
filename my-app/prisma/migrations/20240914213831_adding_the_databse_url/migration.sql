-- CreateTable
CREATE TABLE "CryptoAddress" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "donationTimestamp" TIMESTAMP(3),
    "donationAmount" DOUBLE PRECISION,

    CONSTRAINT "CryptoAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CryptoAddress_address_key" ON "CryptoAddress"("address");
