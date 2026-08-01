import type { Metadata } from "next";
import { HeroSlider } from "@/components/home/HeroSlider";
import { SectionHeader } from "@/components/home/SectionHeader";
import { LatestNewsFeed } from "@/components/home/LatestNewsFeed";
import { TrendingRail } from "@/components/home/TrendingRail";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { SidebarWidgets } from "@/components/home/SidebarWidgets";
import { AdSlot } from "@/components/news/AdSlot";
import { getAdSlotConfig } from "@/lib/api/adSlots";
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
  const [featured, trending, latest, leaderboardAd] = await Promise.all([
    getFeaturedArticles(6),
    getTrendingArticles(8),
    getLatestArticles(9, 1),
    getAdSlotConfig("leaderboard"),
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

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <AdSlot placement="leaderboard" config={leaderboardAd} />
      </div>

      {showcases.map(({ category, items }, i) => (
        <div key={category.id}>
          <CategoryShowcase category={category} articles={items} />
          {(i + 1) % 3 === 0 && (
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
              <AdSlot placement="leaderboard" config={leaderboardAd} />
            </div>
          )}
        </div>
      ))}

      <NewsletterCTA />
    </>
  );
}
