import { prisma } from "@/lib/db/prisma";
import type { Author, Article } from "@/types";
import { mapArticle } from "./articles.db";

// User has no dedicated `slug` column, so author slugs are derived from
// the email prefix — the same convention articles.db.ts already uses
// when mapping an article's author. Keeping both in sync matters: if
// this ever diverges from articles.db.ts, author links on article pages
// will silently 404.
function deriveSlug(email: string): string {
  return email.split("@")[0];
}

function mapAuthor(u: {
  id: string;
  email: string;
  name: string;
  title: string | null;
  bio: string | null;
  avatarUrl: string | null;
  twitter: string | null;
}): Author {
  return {
    id: u.id,
    slug: deriveSlug(u.email),
    name: u.name,
    title: u.title ?? "",
    bio: u.bio ?? "",
    avatarUrl: u.avatarUrl ?? "",
    twitter: u.twitter ?? undefined,
  };
}

export async function listAuthorsDb(): Promise<Author[]> {
  const users = await prisma.user.findMany();
  return users.map(mapAuthor);
}

export async function getAuthorBySlugDb(slug: string): Promise<Author | null> {
  // No indexed lookup possible since the slug isn't a real column — fine
  // at this scale (a handful of bylines), would need a real slug field
  // on User if the newsroom grows to many contributors.
  const users = await prisma.user.findMany();
  const match = users.find((u) => deriveSlug(u.email) === slug);
  return match ? mapAuthor(match) : null;
}

const includeRelations = {
  category: true,
  author: true,
  tags: true,
  coverImage: true,
  gallery: true,
} as const;

export async function getArticlesByAuthorIdDb(authorId: string): Promise<Article[]> {
  const rows = await prisma.article.findMany({
    where: { authorId, status: "PUBLISHED" },
    include: includeRelations,
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(mapArticle);
}
