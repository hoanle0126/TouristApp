CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "badge" TEXT,
    "score" DOUBLE PRECISION NOT NULL,
    "scoreLabel" TEXT NOT NULL,
    "scoreSummary" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',
    "listingImage" TEXT NOT NULL,
    "listingAlt" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "heroAlt" TEXT NOT NULL,
    "description" JSONB NOT NULL,
    "amenities" JSONB NOT NULL,
    "suites" JSONB NOT NULL,
    "gallery" JSONB NOT NULL,
    "reviewScores" JSONB NOT NULL,
    "reviews" JSONB NOT NULL,
    "booking" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "_DestinationToHotel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE TABLE "_HotelToTour" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "Hotel_slug_key" ON "Hotel"("slug");
CREATE INDEX "Hotel_location_idx" ON "Hotel"("location");
CREATE INDEX "Hotel_status_idx" ON "Hotel"("status");
CREATE UNIQUE INDEX "_DestinationToHotel_AB_unique" ON "_DestinationToHotel"("A", "B");
CREATE INDEX "_DestinationToHotel_B_index" ON "_DestinationToHotel"("B");
CREATE UNIQUE INDEX "_HotelToTour_AB_unique" ON "_HotelToTour"("A", "B");
CREATE INDEX "_HotelToTour_B_index" ON "_HotelToTour"("B");

ALTER TABLE "_DestinationToHotel" ADD CONSTRAINT "_DestinationToHotel_A_fkey" FOREIGN KEY ("A") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_DestinationToHotel" ADD CONSTRAINT "_DestinationToHotel_B_fkey" FOREIGN KEY ("B") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_HotelToTour" ADD CONSTRAINT "_HotelToTour_A_fkey" FOREIGN KEY ("A") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_HotelToTour" ADD CONSTRAINT "_HotelToTour_B_fkey" FOREIGN KEY ("B") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
