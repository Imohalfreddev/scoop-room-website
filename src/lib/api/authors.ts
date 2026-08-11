import { USE_MOCK_API } from "./config";
import type { Author, Article } from "@/types";
import { authorBySlug as mockAuthorBySlug } from "@/lib/mock/authors";
import { articles as mockArticles } from "@/lib/mock/articles";

const isServer = () => typeof window === "undefined";

export async function getAuthorBySlug(slug: string): Promise<Author | undefined> {
  if (isServer() && !USE_MOCK_API) {
    const { getAuthorBySlugDb } = await import("@/lib/repository/authors.db");
    const dbAuthor = await getAuthorBySlugDb(slug);
    if (dbAuthor) return dbAuthor;
  }
  return mockAuthorBySlug(slug);
}

export async function getArticlesByAuthor(author: Author): Promise<Article[]> {
  if (isServer() && !USE_MOCK_API) {
    const { getArticlesByAuthorIdDb } = await import("@/lib/repository/authors.db");
    return getArticlesByAuthorIdDb(author.id);
  }
  return mockArticles.filter((a) => a.author.id === author.id);
}
