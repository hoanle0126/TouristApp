-- CreateTable
CREATE TABLE "AboutPageContent" (
    "id" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "heroAlt" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "storyImage" TEXT NOT NULL,
    "storyAlt" TEXT NOT NULL,
    "storyHeading" TEXT NOT NULL,
    "storyBody" JSONB NOT NULL,
    "storyCtaLabel" TEXT NOT NULL,
    "mission" TEXT NOT NULL,
    "vision" TEXT NOT NULL,
    "curators" JSONB NOT NULL,
    "philosophy" JSONB NOT NULL,
    "cta" TEXT NOT NULL,
    "ctaButtonLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutPageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactPageContent" (
    "id" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "formTitle" TEXT NOT NULL,
    "formSubtitle" TEXT NOT NULL,
    "offices" JSONB NOT NULL,
    "departments" JSONB NOT NULL,
    "mapImage" TEXT NOT NULL,
    "mapAlt" TEXT NOT NULL,
    "mapTitle" TEXT NOT NULL,
    "mapNote" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactPageContent_pkey" PRIMARY KEY ("id")
);
