import { NextRequest, NextResponse } from "next/server";
import { queryArticles } from "@/lib/repository/articles";
import { queryArticlesDb } from "@/lib/repository/articles.db";
import { USE_MOCK_API } from "@/lib/api/config";
import type { CategorySlug } from "@/types";

/**
 * GET /api/articles
 *
 * Query params:
 *  - category   CategorySlug
 *  - tag        tag slug
 *  - featured   "true"
 *  - trending   "true"
 *  - q          free text search across title/dek
 *  - page       default 1
 *  - pageSize   default 12
 *
 * This is the exact shape the aggregator's /articles endpoint should
 * return so src/lib/api/articles.ts can point at it with no other changes.
 * The filtering logic itself lives in src/lib/repository/articles.ts so
 * Server Components can also call it directly without a self-referential
 * network hop (see src/lib/api/articles.ts).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const result = USE_MOCK_API
    ? queryArticles({
        category: searchParams.get("category") as CategorySlug | null,
        tag: searchParams.get("tag"),
        featured: searchParams.get("featured") === "true",
        trending: searchParams.get("trending") === "true",
        q: searchParams.get("q")?.toLowerCase(),
        page: Number(searchParams.get("page") ?? "1"),
        pageSize: Number(searchParams.get("pageSize") ?? "12"),
      })
    : await queryArticlesDb({
        category: searchParams.get("category") as CategorySlug | null,
        tag: searchParams.get("tag"),
        featured: searchParams.get("featured") === "true",
        trending: searchParams.get("trending") === "true",
        q: searchParams.get("q")?.toLowerCase(),
        page: Number(searchParams.get("page") ?? "1"),
        pageSize: Number(searchParams.get("pageSize") ?? "12"),
      });

  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
  });
}
