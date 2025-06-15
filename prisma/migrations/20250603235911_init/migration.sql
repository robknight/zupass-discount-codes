-- CreateTable
CREATE TABLE "VoucherCode" (
    "id" SERIAL NOT NULL,
    "voucher_code" TEXT NOT NULL,
    "nullifier" TEXT,

    CONSTRAINT "VoucherCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VoucherCode_voucher_code_key" ON "VoucherCode"("voucher_code");

-- CreateIndex
CREATE UNIQUE INDEX "VoucherCode_nullifier_key" ON "VoucherCode"("nullifier");
