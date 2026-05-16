ALTER TABLE "SiteContentConfig"
ADD COLUMN     "heroImageTwo" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
ADD COLUMN     "heroImageTwoAlt" TEXT NOT NULL DEFAULT 'Golden evening light over a secluded tropical bay',
ADD COLUMN     "heroImageThree" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
ADD COLUMN     "heroImageThreeAlt" TEXT NOT NULL DEFAULT 'A sweeping coastline with clear water and distant cliffs';
