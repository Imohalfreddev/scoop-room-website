import { NextRequest, NextResponse } from "next/server";
import { articles } from "@/lib/mock/articles";
import { trendingSearches } from "@/lib/mock/widgets";
import { USE_MOCK_API } from "@/lib/api/config";
import type { SearchResult } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const category = searchParams.get("category") ?? undefined;
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;

  if (!USE_MOCK_API) {
    const { searchArticlesDb } = await import("@/lib/repository/articles.db");
    const { items, total } = await searchArticlesDb({ q, category, from, to, limit: 30 });
    const result: SearchResult = { query: q, items, total, suggestions: trendingSearches };
    return NextResponse.json(result);
  }

  let items = articles.filter((a) => a.status === "published");

  if (q) {
    items = items.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.dek.toLowerCase().includes(q) ||
        a.tags.some((t) => t.name.toLowerCase().includes(q))
    );
  }
  if (category) items = items.filter((a) => a.category.slug === category);
  if (from) items = items.filter((a) => a.publishedAt >= from);
  if (to) items = items.filter((a) => a.publishedAt <= to);

  const result: SearchResult = {
    query: q,
    items: items.slice(0, 30),
    total: items.length,
    suggestions: trendingSearches,
  };

  return NextResponse.json(result);
}
