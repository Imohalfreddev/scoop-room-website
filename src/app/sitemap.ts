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
    { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${site.url}/ethics`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${site.url}/advertise`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${site.url}/careers`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${site.url}/contact`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/cookies`, changeFrequency: "yearly", priority: 0.2 },
  ];
  // /search is intentionally excluded — robots.ts disallows it and the page
  // itself sets `robots: { index: false }`, so it should never appear here.

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

  // Author archive pages now work in both DB and mock mode (fixed
  // alongside src/app/(site)/author/[slug]/page.tsx), so both branches
  // list real, working author URLs here.
  let authorSlugs: string[];
  if (!USE_MOCK_API) {
    const { listAuthorsDb } = await import("@/lib/repository/authors.db");
    authorSlugs = (await listAuthorsDb()).map((a) => a.slug);
  } else {
    authorSlugs = authors.map((a) => a.slug);
  }
  const authorRoutes: MetadataRoute.Sitemap = authorSlugs.map((slug) => ({
    url: `${site.url}/author/${slug}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes, ...blogRoutes, ...authorRoutes];
}
