-- CreateTable
CREATE TABLE "TravelMoment" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelMoment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TravelMoment_sortOrder_idx" ON "TravelMoment"("sortOrder");
