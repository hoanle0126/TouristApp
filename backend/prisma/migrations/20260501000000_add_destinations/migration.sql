CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "market" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',
    "heroImage" TEXT NOT NULL,
    "heroAlt" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "intro" JSONB NOT NULL,
    "facts" JSONB NOT NULL,
    "spotlight" JSONB NOT NULL,
    "relatedTours" JSONB NOT NULL,
    "relatedHotels" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");
CREATE INDEX "Destination_market_idx" ON "Destination"("market");
CREATE INDEX "Destination_status_idx" ON "Destination"("status");
