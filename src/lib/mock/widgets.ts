import type { AnalyticsSnapshot } from "@/types";
import { articles } from "./articles";

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