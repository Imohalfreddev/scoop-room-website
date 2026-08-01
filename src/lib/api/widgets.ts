import { apiFetch, USE_MOCK_API } from "./config";
import type { Article, MarketQuote, WeatherData } from "@/types";

const isServer = () => typeof window === "undefined";

export async function getWeather(): Promise<WeatherData> {
  if (isServer() && USE_MOCK_API) {
    const { weatherMock } = await import("@/lib/mock/widgets");
    return weatherMock;
  }
  return apiFetch<WeatherData>("/api/weather", { next: { revalidate: 900 } });
}

export async function getMarkets(): Promise<MarketQuote[]> {
  if (isServer() && USE_MOCK_API) {
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
  if (isServer() && USE_MOCK_API) {
    const { trendingArticles } = await import("@/lib/mock/articles");
    const { trendingSearches } = await import("@/lib/mock/widgets");
    return { articles: trendingArticles.slice(0, 8), searches: trendingSearches };
  }
  return apiFetch("/api/trending", { next: { revalidate: 120 } });
}
