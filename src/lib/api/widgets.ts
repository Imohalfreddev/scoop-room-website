import { apiFetch } from "./config";
import type { Article, MarketQuote, WeatherData } from "@/types";

const isServer = () => typeof window === "undefined";

// getWeather/getMarkets/getTrending's underlying API routes are still mock
// data regardless of USE_MOCK_API (no real weather/markets provider wired
// up yet - see src/app/api/weather, src/app/api/markets). Since that's true
// either way, read the mock directly on the server instead of doing an
// HTTP self-fetch to this app's own /api/* routes: that fetch works fine
// once deployed and actually running, but fails during \
ext build\'s
// static generation, since the server isn't listening at that point yet
// (the classic self-referencing-fetch-at-build-time trap). Client-side
// (browser) fetches are unaffected and still go through apiFetch normally.

export async function getWeather(): Promise<WeatherData> {
  if (isServer()) {
    const { weatherMock } = await import("@/lib/mock/widgets");
    return weatherMock;
  }
  return apiFetch<WeatherData>("/api/weather", { next: { revalidate: 900 } });
}

export async function getMarkets(): Promise<MarketQuote[]> {
  if (isServer()) {
    const { marketsMock } = await import("@/lib/mock/widgets");
    return marketsMock;
  }
  const { items } = await apiFetch<{ items: MarketQuote[] }>("/api/markets", {
    next: { revalidate: 60 },
  });
  return items;
}

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