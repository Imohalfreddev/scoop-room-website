import { NextRequest, NextResponse } from "next/server";
import { blogPosts } from "@/lib/mock/blog";
import { getBlogArticlesDb } from "@/lib/repository/articles.db";
import { USE_MOCK_API } from "@/lib/api/config";

/**
 * GET /api/blog
 *
 * Query params: page (default 1), pageSize (default 24).
 * Mirrors /api/articles but scoped to type: "BLOG" — see
 * src/lib/repository/articles.db.ts.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "24");

  const result = USE_MOCK_API
    ? {
        items: blogPosts,
        total: blogPosts.length,
        page: 1,
        pageSize: blogPosts.length,
        hasMore: false,
      }
    : await getBlogArticlesDb({ page, pageSize });

  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
  });
}
