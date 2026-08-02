/**
 * Domain types for Scoop Room.
 *
 * These types are the single contract shared by:
 *   - the mock data layer (src/lib/mock)
 *   - the local API route handlers (src/app/api)
 *   - the client-facing data services (src/lib/api)
 *   - the Prisma schema (prisma/schema.prisma)
 *
 * When the real news aggregator backend is wired in, its REST responses
 * should be mapped (in src/lib/api/*) into these exact shapes so nothing
 * above the service layer has to change.
 */

export type CategorySlug =
  | "nigeria"
  | "africa"
  | "world"
  | "politics"
  | "business"
  | "technology"
  | "entertainment"
  | "sports"
  | "lifestyle"
  | "ai";

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string;
  color?: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}

export interface Author {
  id: string;
  slug: string;
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  twitter?: string;
  articleCount?: number;
}

export type MediaType = "image" | "video" | "document";

export interface MediaAsset {
  id: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  sizeKb?: number;
  createdAt: string;
  folder?: string;
}

export type ArticleStatus = "draft" | "scheduled" | "published";

export interface SeoFields {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorAvatar?: string;
  body: string;
  createdAt: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  dek: string; // one-line summary / subhead
  excerpt: string;
  content: string; // rich HTML from the editor
  coverImage: string;
  gallery?: MediaAsset[];
  videoUrl?: string;
  category: Category;
  tags: Tag[];
  author: Author;
  status: ArticleStatus;
  featured: boolean;
  trending: boolean;
  sponsored?: boolean;
  publishedAt: string;
  scheduledFor?: string;
  updatedAt: string;
  readTimeMinutes: number;
  views: number;
  seo?: SeoFields;
}

export interface ArticleListResult {
  items: Article[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface SearchResult {
  query: string;
  items: Article[];
  total: number;
  suggestions: string[];
}

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
  source?: string;
}

export interface AnalyticsSnapshot {
  totalViews: number;
  totalArticles: number;
  totalSubscribers: number;
  viewsTrend: { date: string; views: number }[];
  topArticles: { title: string; slug: string; views: number }[];
  categoryBreakdown: { category: string; percent: number }[];
}

export interface AdSlotConfig {
  id: string;
  placement: "leaderboard" | "in-article" | "sidebar" | "sponsored-post";
  label: string;
  imageUrl?: string;
  href?: string;
  advertiser?: string;
  active: boolean;
}