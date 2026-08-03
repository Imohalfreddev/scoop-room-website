import type { Metadata } from "next";
import { HeroSlider } from "@/components/home/HeroSlider";
import { SectionHeader } from "@/components/home/SectionHeader";
import { LatestNewsFeed } from "@/components/home/LatestNewsFeed";
import { TrendingRail } from "@/components/home/TrendingRail";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { SidebarWidgets } from "@/components/home/SidebarWidgets";
import { AdSlot } from "@/components/news/AdSlot";
import { getAdSlotConfigs } from "@/lib/api/adSlots";
import {
  getFeaturedArticles,
  getTrendingArticles,
  getLatestArticles,
  getArticlesByCategory,
} from "@/lib/api/articles";
import { categories } from "@/lib/mock/categories";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

export const revalidate = 60;

export default async function HomePage() {
  const [featured, trending, latest, leaderboardAds] = await Promise.all([
    getFeaturedArticles(6),
    getTrendingArticles(8),
    getLatestArticles(9, 1),
    getAdSlotConfigs("leaderboard"),
  ]);

  const showcaseSlugs = [
    "nigeria",
    "africa",
    "world",
    "politics",
    "business",
    "technology",
    "entertainment",
    "sports",
    "lifestyle",
    "ai",
  ] as const;

  const showcases = await Promise.all(
    showcaseSlugs.map(async (slug) => {
      const category = categories.find((c) => c.slug === slug)!;
      const { items } = await getArticlesByCategory(slug, 1, 4);
      return { category, items };
    })
  );

  return (
    <>
      <HeroSlider articles={featured} />

      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        <SectionHeader eyebrow="Fresh off the desk" title="Latest News" />
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <LatestNewsFeed initialArticles={latest.items} initialHasMore={latest.hasMore} />
          <SidebarWidgets />
        </div>
      </section>

      <TrendingRail articles={trending} />

      {/* Ad 1 of 2 — top of feed. */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <AdSlot placement="leaderboard" configs={leaderboardAds} />
      </div>

      {showcases.map(({ category, items }) => (
        <CategoryShowcase key={category.id} category={category} articles={items} />
      ))}

      {/* Ad 2 of 2 — after all category sections, standing alone. */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <AdSlot placement="leaderboard" configs={leaderboardAds} />
      </div>

      <NewsletterCTA />
    </>
  );
}