-- Precondition: every existing tour must already have at least one row in _DestinationToTour.
-- If any row is missing, backfill a destination before running this migration because destinationId becomes required.

ALTER TABLE "Tour" ADD COLUMN "destinationId" TEXT;

UPDATE "Tour" t
SET "destinationId" = dt."A"
FROM (
  SELECT DISTINCT ON ("B") "A", "B"
  FROM "_DestinationToTour"
  ORDER BY "B", "A"
) dt
WHERE t."id" = dt."B";

ALTER TABLE "Tour"
ALTER COLUMN "destinationId" SET NOT NULL;

ALTER TABLE "Tour"
ADD CONSTRAINT "Tour_destinationId_fkey"
FOREIGN KEY ("destinationId") REFERENCES "Destination"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "Tour_destinationId_idx" ON "Tour"("destinationId");

DROP TABLE "_DestinationToTour";
