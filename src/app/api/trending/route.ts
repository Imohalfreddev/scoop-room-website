import { NextResponse } from "next/server";
import { trendingArticles } from "@/lib/mock/articles";
import { trendingSearches } from "@/lib/mock/widgets";

export async function GET() {
  return NextResponse.json({
    articles: trendingArticles.slice(0, 8),
    searches: trendingSearches,
  });
}
