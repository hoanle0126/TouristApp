-- AlterTable
ALTER TABLE "SiteContentConfig" ADD COLUMN     "facebookUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "instagramUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tiktokUrl" TEXT NOT NULL DEFAULT '';
