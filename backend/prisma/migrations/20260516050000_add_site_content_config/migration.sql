CREATE TABLE "SiteContentConfig" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL,
    "siteTagline" TEXT NOT NULL,
    "siteDescription" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "hotline" TEXT NOT NULL,
    "topBarNote" TEXT NOT NULL,
    "promoLabel" TEXT NOT NULL,
    "promoCta" TEXT NOT NULL,
    "promoHref" TEXT NOT NULL,
    "homeHeroImage" TEXT NOT NULL,
    "homeHeroAlt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContentConfig_pkey" PRIMARY KEY ("id")
);
