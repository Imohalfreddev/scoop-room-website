-- CreateEnum
CREATE TYPE "ArticleType" AS ENUM ('NEWS', 'BLOG');

-- AlterTable: articles get a type so blog posts and news share one table
-- but are queried separately. Existing rows all default to NEWS.
ALTER TABLE "articles" ADD COLUMN "type" "ArticleType" NOT NULL DEFAULT 'NEWS';

-- CreateIndex
CREATE INDEX "articles_type_status_publishedAt_idx" ON "articles"("type", "status", "publishedAt");

-- AlterTable: ad slots move from a single imageUrl to a picture array so
-- one ad can auto-slide through several images.
ALTER TABLE "ad_slot_configs" ADD COLUMN "images" TEXT[] NOT NULL DEFAULT '{}';

-- Backfill: carry any existing single image into the new array so nothing
-- already configured goes blank.
UPDATE "ad_slot_configs"
SET "images" = ARRAY["imageUrl"]
WHERE "imageUrl" IS NOT NULL AND "imageUrl" <> '';

ALTER TABLE "ad_slot_configs" DROP COLUMN "imageUrl";
