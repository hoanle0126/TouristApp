CREATE TABLE "TourDeparture" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "capacity" INTEGER NOT NULL,
    "booked" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourDeparture_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HotelInventoryDay" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "totalRooms" INTEGER NOT NULL,
    "bookedRooms" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HotelInventoryDay_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "BookingItem" ADD COLUMN "tourDepartureId" TEXT;

CREATE UNIQUE INDEX "TourDeparture_tourId_date_key" ON "TourDeparture"("tourId", "date");
CREATE INDEX "TourDeparture_date_idx" ON "TourDeparture"("date");
CREATE INDEX "TourDeparture_status_idx" ON "TourDeparture"("status");
CREATE UNIQUE INDEX "HotelInventoryDay_hotelId_date_key" ON "HotelInventoryDay"("hotelId", "date");
CREATE INDEX "HotelInventoryDay_date_idx" ON "HotelInventoryDay"("date");
CREATE INDEX "HotelInventoryDay_status_idx" ON "HotelInventoryDay"("status");
CREATE INDEX "BookingItem_tourDepartureId_idx" ON "BookingItem"("tourDepartureId");

ALTER TABLE "TourDeparture" ADD CONSTRAINT "TourDeparture_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HotelInventoryDay" ADD CONSTRAINT "HotelInventoryDay_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BookingItem" ADD CONSTRAINT "BookingItem_tourDepartureId_fkey" FOREIGN KEY ("tourDepartureId") REFERENCES "TourDeparture"("id") ON DELETE SET NULL ON UPDATE CASCADE;
