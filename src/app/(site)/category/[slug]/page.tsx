import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/lib/mock/categories";
import { getCategoryBySlug } from "@/lib/api/categories";
import { getArticlesByCategory } from "@/lib/api/articles";
import { ArticleCard } from "@/components/news/ArticleCard";
import { LatestNewsFeed } from "@/components/home/LatestNewsFeed";
import { SidebarWidgets } from "@/components/home/SidebarWidgets";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { site } from "@/lib/constants";
import type { CategorySlug } from "@/types";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: { title: `${category.name} | ${site.name}`, description: category.description },
  };
}

export const revalidate = 60;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { items, hasMore } = await getArticlesByCategory(
    category.slug as CategorySlug,
    1,
    10
  );
  const [lead, ...rest] = items;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.url },
          { name: category.name, url: `${site.url}/category/${category.slug}` },
        ])}
      />

      <div className="wire mb-8 pl-3">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-signal">
          Section
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-2 max-w-xl text-muted">{category.description}</p>
      </div>

      {lead && (
        <div className="mb-12 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <ArticleCard article={lead} variant="featured" priority />
          <div className="space-y-5">
            {rest.slice(0, 3).map((a) => (
              <ArticleCard key={a.id} article={a} variant="compact" />
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <LatestNewsFeed
          initialArticles={rest.slice(3)}
          initialHasMore={hasMore}
          category={category.slug as CategorySlug}
        />
        <SidebarWidgets />
      </div>
    </div>
  );
}
