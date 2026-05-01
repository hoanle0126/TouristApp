CREATE TABLE "_DestinationToTour" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_DestinationToTour_AB_unique" ON "_DestinationToTour"("A", "B");
CREATE INDEX "_DestinationToTour_B_index" ON "_DestinationToTour"("B");

ALTER TABLE "_DestinationToTour" ADD CONSTRAINT "_DestinationToTour_A_fkey" FOREIGN KEY ("A") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_DestinationToTour" ADD CONSTRAINT "_DestinationToTour_B_fkey" FOREIGN KEY ("B") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
