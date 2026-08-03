import { apiFetch, USE_MOCK_API } from "./config";
import type {
  Article,
  ArticleListResult,
  CategorySlug,
} from "@/types";

export interface ArticleQuery {
  category?: CategorySlug;
  tag?: string;
  featured?: boolean;
  trending?: boolean;
  q?: string;
  page?: number;
  pageSize?: number;
}

function toQueryString(query: ArticleQuery) {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.tag) params.set("tag", query.tag);
  if (query.featured) params.set("featured", "true");
  if (query.trending) params.set("trending", "true");
  if (query.q) params.set("q", query.q);
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  return params.toString();
}

const isServer = () => typeof window === "undefined";

/** Generic paginated fetch — every homepage rail and category page uses this. */
export async function listArticles(query: ArticleQuery = {}): Promise<ArticleListResult> {
  // Server Components in mock mode read the repository directly instead of
  // making an HTTP request to this app's own /api/articles route — Next.js
  // doesn't have a listener for that self-referential fetch during static
  // generation/build. Client-side calls (and live-aggregator mode) still go
  // through the real REST endpoint below.
  if (isServer() && USE_MOCK_API) {
    const { queryArticles } = await import("@/lib/repository/articles");
    return queryArticles(query);
  }
  if (isServer() && !USE_MOCK_API) {
    const { queryArticlesDb } = await import("@/lib/repository/articles.db");
    return queryArticlesDb(query);
  }
  const qs = toQueryString(query);
  return apiFetch<ArticleListResult>(`/api/articles${qs ? `?${qs}` : ""}`);
}

export async function getFeaturedArticles(limit = 6): Promise<Article[]> {
  const { items } = await listArticles({ featured: true, pageSize: limit });
  return items;
}

export async function getTrendingArticles(limit = 8): Promise<Article[]> {
  const { items } = await listArticles({ trending: true, pageSize: limit });
  return items;
}

export async function getLatestArticles(limit = 12, page = 1): Promise<ArticleListResult> {
  return listArticles({ page, pageSize: limit });
}

export async function getArticlesByCategory(
  category: CategorySlug,
  page = 1,
  pageSize = 12
): Promise<ArticleListResult> {
  return listArticles({ category, page, pageSize });
}

export async function getArticleBySlug(
  slug: string
): Promise<{ article: Article; related: Article[] } | null> {
  try {
    if (isServer() && USE_MOCK_API) {
      const { getArticleWithRelated } = await import("@/lib/repository/articles");
      return getArticleWithRelated(slug);
    }
    if (isServer() && !USE_MOCK_API) {
      const { getArticleWithRelatedDb } = await import("@/lib/repository/articles.db");
      return getArticleWithRelatedDb(slug);
    }
    return await apiFetch(`/api/articles/${slug}`, {
      next: { revalidate: 60 },
    });
  } catch {
    return null;
  }
}

/**
 * Blog posts (src/app/(site)/blog) live in the same `articles` table as
 * news, distinguished by `type: "BLOG"` — see prisma/schema.prisma. In mock
 * mode this still reads from src/lib/mock/blog.ts, exactly like every other
 * page here falls back to its own mock/* data.
 */
export async function getBlogPosts(page = 1, pageSize = 24): Promise<ArticleListResult> {
  if (isServer() && USE_MOCK_API) {
    const { blogPosts } = await import("@/lib/mock/blog");
    return { items: blogPosts, total: blogPosts.length, page: 1, pageSize: blogPosts.length, hasMore: false };
  }
  if (isServer() && !USE_MOCK_API) {
    const { getBlogArticlesDb } = await import("@/lib/repository/articles.db");
    return getBlogArticlesDb({ page, pageSize });
  }
  const qs = toQueryString({ page, pageSize });
  return apiFetch<ArticleListResult>(`/api/blog${qs ? `?${qs}` : ""}`);
}

export async function getBlogPostBySlug(
  slug: string
): Promise<{ article: Article; related: Article[] } | null> {
  try {
    if (isServer() && USE_MOCK_API) {
      const { blogPostBySlug, relatedBlogPosts } = await import("@/lib/mock/blog");
      const article = blogPostBySlug(slug);
      if (!article) return null;
      return { article, related: relatedBlogPosts(article) };
    }
    if (isServer() && !USE_MOCK_API) {
      const { getBlogArticleWithRelatedDb } = await import("@/lib/repository/articles.db");
      return getBlogArticleWithRelatedDb(slug);
    }
    return await apiFetch(`/api/blog/${slug}`, { next: { revalidate: 60 } });
  } catch {
    return null;
  }
}

/**
 * Article creation/editing/deletion happens exclusively in the separate
 * admin app now (see scoop-room-admin) — it's the only thing with write
 * access to this database. This file only ever reads.
 */
export interface ArticleDraftInput {
  title: string;
  dek: string;
  content: string;
  categorySlug: CategorySlug;
  tagSlugs: string[];
  coverImage: string;
  status: "draft" | "scheduled" | "published";
  scheduledFor?: string;
  featured?: boolean;
  seo?: { metaTitle?: string; metaDescription?: string };
}
