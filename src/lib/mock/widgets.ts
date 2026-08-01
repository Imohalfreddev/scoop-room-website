import type { AnalyticsSnapshot, MarketQuote, WeatherData } from "@/types";
import { articles } from "./articles";

export const weatherMock: WeatherData = {
  location: "Lagos, NG",
  tempC: 29,
  condition: "Partly Cloudy",
  icon: "cloud-sun",
  updatedAt: new Date().toISOString(),
};

export const marketsMock: MarketQuote[] = [
  { symbol: "NGX-ASI", name: "NGX All-Share Index", price: 104213.5, changePercent: 0.62 },
  { symbol: "USD/NGN", name: "US Dollar", price: 1542.3, changePercent: -0.14 },
  { symbol: "BRENT", name: "Brent Crude", price: 82.47, changePercent: 1.08 },
  { symbol: "BTC", name: "Bitcoin", price: 71230, changePercent: 2.31 },
  { symbol: "GOLD", name: "Gold Spot", price: 2394.1, changePercent: 0.21 },
];

export const trendingSearches: string[] = [
  "Naira exchange rate",
  "Super Eagles squad",
  "Fuel subsidy",
  "AI regulation",
  "Lagos flooding",
  "Election commission",
  "Afrobeats tour dates",
];

export const analyticsMock: AnalyticsSnapshot = {
  totalViews: articles.reduce((sum, a) => sum + a.views, 0),
  totalArticles: articles.length,
  totalSubscribers: 48213,
  viewsTrend: Array.from({ length: 14 }).map((_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toISOString().slice(0, 10),
    views: 18000 + Math.round(Math.sin(i / 2) * 4000 + i * 900),
  })),
  topArticles: [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 6)
    .map((a) => ({ title: a.title, slug: a.slug, views: a.views })),
  categoryBreakdown: [
    { category: "Nigeria", percent: 22 },
    { category: "Business", percent: 18 },
    { category: "Sports", percent: 16 },
    { category: "Technology", percent: 14 },
    { category: "Politics", percent: 12 },
    { category: "Other", percent: 18 },
  ],
};
