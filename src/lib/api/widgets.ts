import { apiFetch } from "./config";
import type { Article } from "@/types";

const isServer = () => typeof window === "undefined";

export async function getTrending(): Promise<{
  articles: Article[];
  searches: string[];
}> {
  if (isServer()) {
    const { trendingArticles } = await import("@/lib/mock/articles");
    const { trendingSearches } = await import("@/lib/mock/widgets");
    return { articles: trendingArticles.slice(0, 8), searches: trendingSearches };
  }
  return apiFetch("/api/trending", { next: { revalidate: 120 } });
}