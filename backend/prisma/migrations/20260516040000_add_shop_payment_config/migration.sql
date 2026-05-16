CREATE TABLE "ShopPaymentConfig" (
    "id" TEXT NOT NULL,
    "bankBin" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopPaymentConfig_pkey" PRIMARY KEY ("id")
);
