ALTER TABLE "Tour"
  DROP COLUMN "alt",
  DROP COLUMN "heroAlt",
  DROP COLUMN "curatorImageAlt";

ALTER TABLE "Destination"
  DROP COLUMN "alt",
  DROP COLUMN "heroAlt";

ALTER TABLE "MomentCaptured"
  DROP COLUMN "alt";

ALTER TABLE "Hotel"
  DROP COLUMN "listingAlt",
  DROP COLUMN "heroAlt";

ALTER TABLE "BlogPost"
  DROP COLUMN "alt",
  DROP COLUMN "heroAlt";

UPDATE "Tour"
SET "gallery" = COALESCE(
  (
    SELECT jsonb_agg(item - 'alt')
    FROM jsonb_array_elements("gallery"::jsonb) AS item
  ),
  '[]'::jsonb
)::json
WHERE jsonb_typeof("gallery"::jsonb) = 'array';

UPDATE "Hotel"
SET "gallery" = COALESCE(
  (
    SELECT jsonb_agg(item - 'alt')
    FROM jsonb_array_elements("gallery"::jsonb) AS item
  ),
  '[]'::jsonb
)::json
WHERE jsonb_typeof("gallery"::jsonb) = 'array';

UPDATE "Hotel"
SET "suites" = COALESCE(
  (
    SELECT jsonb_agg(item - 'alt')
    FROM jsonb_array_elements("suites"::jsonb) AS item
  ),
  '[]'::jsonb
)::json
WHERE jsonb_typeof("suites"::jsonb) = 'array';

UPDATE "BlogPost"
SET "inlineImage" = ("inlineImage"::jsonb - 'alt')::json
WHERE jsonb_typeof("inlineImage"::jsonb) = 'object';

UPDATE "BlogPost"
SET "secondaryFeature" = jsonb_set(
  "secondaryFeature"::jsonb,
  '{image}',
  ("secondaryFeature"::jsonb #> '{image}') - 'alt'
)::json
WHERE jsonb_typeof("secondaryFeature"::jsonb #> '{image}') = 'object';

UPDATE "BlogPost"
SET "relatedPosts" = COALESCE(
  (
    SELECT jsonb_agg(item - 'alt')
    FROM jsonb_array_elements("relatedPosts"::jsonb) AS item
  ),
  '[]'::jsonb
)::json
WHERE jsonb_typeof("relatedPosts"::jsonb) = 'array';
