-- AlterTable
ALTER TABLE "_BlogMentionedDestinations" ADD CONSTRAINT "_BlogMentionedDestinations_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_BlogMentionedDestinations_AB_unique";

-- AlterTable
ALTER TABLE "_BlogMentionedHotels" ADD CONSTRAINT "_BlogMentionedHotels_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_BlogMentionedHotels_AB_unique";

-- AlterTable
ALTER TABLE "_BlogMentionedTours" ADD CONSTRAINT "_BlogMentionedTours_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_BlogMentionedTours_AB_unique";

-- AlterTable
ALTER TABLE "_DestinationToHotel" ADD CONSTRAINT "_DestinationToHotel_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_DestinationToHotel_AB_unique";

-- AlterTable
ALTER TABLE "_DestinationToTour" ADD CONSTRAINT "_DestinationToTour_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_DestinationToTour_AB_unique";

-- AlterTable
ALTER TABLE "_HotelToTour" ADD CONSTRAINT "_HotelToTour_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_HotelToTour_AB_unique";
