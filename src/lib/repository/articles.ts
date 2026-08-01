import { articles, articleBySlug, relatedArticles } from "@/lib/mock/articles";
import type { ArticleListResult, CategorySlug } from "@/types";

export interface RepoArticleQuery {
  category?: CategorySlug | null;
  tag?: string | null;
  featured?: boolean;
  trending?: boolean;
  q?: string | null;
  page?: number;
  pageSize?: number;
}

export function queryArticles(query: RepoArticleQuery = {}): ArticleListResult {
  const {
    category,
    tag,
    featured,
    trending,
    q,
    page = 1,
    pageSize = 12,
  } = query;

  let items = articles.filter((a) => a.status === "published");

  if (category) items = items.filter((a) => a.category.slug === category);
  if (tag) items = items.filter((a) => a.tags.some((t) => t.slug === tag));
  if (featured) items = items.filter((a) => a.featured);
  if (trending) items = items.filter((a) => a.trending);
  if (q) {
    const needle = q.toLowerCase();
    items = items.filter(
      (a) =>
        a.title.toLowerCase().includes(needle) || a.dek.toLowerCase().includes(needle)
    );
  }

  const total = items.length;
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return {
    items: paged,
    total,
    page,
    pageSize,
    hasMore: start + pageSize < total,
  };
}

export function getArticleWithRelated(slug: string) {
  const article = articleBySlug(slug);
  if (!article) return null;
  return { article, related: relatedArticles(article) };
}
