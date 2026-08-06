import type { MetadataRoute } from "next";
import { articles } from "@/lib/mock/articles";
import { categories } from "@/lib/mock/categories";
import { authors } from "@/lib/mock/authors";
import { blogPosts } from "@/lib/mock/blog";
import { site } from "@/lib/constants";
import { USE_MOCK_API } from "@/lib/api/config";

interface SitemapContent {
  categorySlugs: string[];
  articles: { slug: string; updatedAt: string }[];
  blogPosts: { slug: string; updatedAt: string }[];
}

async function getSitemapContent(): Promise<SitemapContent> {
  if (!USE_MOCK_API) {
    const { prisma } = await import("@/lib/db/prisma");
    const [dbCategories, dbArticles, dbBlogPosts] = await Promise.all([
      prisma.category.findMany({ select: { slug: true } }),
      prisma.article.findMany({
        where: { status: "PUBLISHED", type: "NEWS" },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.article.findMany({
        where: { status: "PUBLISHED", type: "BLOG" },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: "desc" },
      }),
    ]);
    return {
      categorySlugs: dbCategories.map((c) => c.slug),
      articles: dbArticles.map((a) => ({ slug: a.slug, updatedAt: a.updatedAt.toISOString() })),
      blogPosts: dbBlogPosts.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt.toISOString() })),
    };
  }
  return {
    categorySlugs: categories.map((c) => c.slug),
    articles: articles.map((a) => ({ slug: a.slug, updatedAt: a.updatedAt })),
    blogPosts: blogPosts.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt })),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSitemapContent();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "hourly", priority: 1 },
    { url: `${site.url}/blog`, changeFrequency: "daily", priority: 0.7 },
    { url: `${site.url}/search`, changeFrequency: "weekly", priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = content.categorySlugs.map((slug) => ({
    url: `${site.url}/category/${slug}`,
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = content.articles.map((a) => ({
    url: `${site.url}/article/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = content.blogPosts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  // Author archive pages (src/app/(site)/author/[slug]/page.tsx) still read
  // from mock data only regardless of USE_MOCK_API — a separate, pre-existing
  // gap this fix doesn't touch. Only list them here in mock mode so the live
  // sitemap never submits an author URL that 404s.
  const authorRoutes: MetadataRoute.Sitemap = USE_MOCK_API
    ? authors.map((a) => ({
        url: `${site.url}/author/${a.slug}`,
        changeFrequency: "weekly",
        priority: 0.4,
      }))
    : [];

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes, ...blogRoutes, ...authorRoutes];
}
