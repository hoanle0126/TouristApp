CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "readingTime" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "heroAlt" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "meta" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "inlineImage" JSONB NOT NULL,
    "secondaryFeature" JSONB NOT NULL,
    "relatedPosts" JSONB NOT NULL,
    "seo" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "_BlogMentionedDestinations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE TABLE "_BlogMentionedHotels" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE TABLE "_BlogMentionedTours" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE INDEX "BlogPost_category_idx" ON "BlogPost"("category");
CREATE INDEX "BlogPost_status_idx" ON "BlogPost"("status");
CREATE INDEX "BlogPost_publishedAt_idx" ON "BlogPost"("publishedAt");
CREATE UNIQUE INDEX "_BlogMentionedDestinations_AB_unique" ON "_BlogMentionedDestinations"("A", "B");
CREATE INDEX "_BlogMentionedDestinations_B_index" ON "_BlogMentionedDestinations"("B");
CREATE UNIQUE INDEX "_BlogMentionedHotels_AB_unique" ON "_BlogMentionedHotels"("A", "B");
CREATE INDEX "_BlogMentionedHotels_B_index" ON "_BlogMentionedHotels"("B");
CREATE UNIQUE INDEX "_BlogMentionedTours_AB_unique" ON "_BlogMentionedTours"("A", "B");
CREATE INDEX "_BlogMentionedTours_B_index" ON "_BlogMentionedTours"("B");

ALTER TABLE "_BlogMentionedDestinations" ADD CONSTRAINT "_BlogMentionedDestinations_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_BlogMentionedDestinations" ADD CONSTRAINT "_BlogMentionedDestinations_B_fkey" FOREIGN KEY ("B") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_BlogMentionedHotels" ADD CONSTRAINT "_BlogMentionedHotels_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_BlogMentionedHotels" ADD CONSTRAINT "_BlogMentionedHotels_B_fkey" FOREIGN KEY ("B") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_BlogMentionedTours" ADD CONSTRAINT "_BlogMentionedTours_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_BlogMentionedTours" ADD CONSTRAINT "_BlogMentionedTours_B_fkey" FOREIGN KEY ("B") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
