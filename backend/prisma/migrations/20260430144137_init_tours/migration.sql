-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "badge" TEXT,
    "type" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "guests" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "description" JSONB NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "heroAlt" TEXT NOT NULL,
    "curatorImage" TEXT NOT NULL,
    "curatorImageAlt" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "highlights" JSONB NOT NULL,
    "itinerary" JSONB NOT NULL,
    "gallery" JSONB NOT NULL,
    "inclusions" JSONB NOT NULL,
    "exclusions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tour_slug_key" ON "Tour"("slug");
