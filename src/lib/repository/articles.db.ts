import { prisma } from "@/lib/db/prisma";
import type {
  Article as DbArticle,
  Category as DbCategory,
  Tag as DbTag,
  MediaAsset as DbMediaAsset,
  User as DbUser,
  ArticleStatus as DbArticleStatus,
} from "@prisma/client";
import type {
  Article,
  ArticleListResult,
  ArticleStatus,
  CategorySlug,
} from "@/types";
import type { RepoArticleQuery } from "./articles";
import type { ArticleDraftInput } from "@/lib/api/articles";

const PLACEHOLDER_COVER = "/brand/scoop-room-placeholder.jpg";

type FullDbArticle = DbArticle & {
  category: DbCategory;
  author: DbUser;
  tags: DbTag[];
  coverImage: DbMediaAsset | null;
  gallery: DbMediaAsset[];
};

const STATUS_TO_SITE: Record<DbArticleStatus, ArticleStatus> = {
  DRAFT: "draft",
  SCHEDULED: "scheduled",
  PUBLISHED: "published",
};
const STATUS_TO_DB: Record<ArticleStatus, DbArticleStatus> = {
  draft: "DRAFT",
  scheduled: "SCHEDULED",
  published: "PUBLISHED",
};

function mapArticle(a: FullDbArticle): Article {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    dek: a.dek,
    excerpt: a.excerpt,
    content: a.content,
    coverImage: a.coverImage?.url ?? PLACEHOLDER_COVER,
    gallery: a.gallery.map((m) => ({
      id: m.id,
      type: m.type.toLowerCase() as "image" | "video" | "document",
      url: m.url,
      thumbnailUrl: m.thumbnailUrl ?? undefined,
      alt: m.alt,
      caption: m.caption ?? undefined,
      width: m.width ?? undefined,
      height: m.height ?? undefined,
      sizeKb: m.sizeKb ?? undefined,
      createdAt: m.createdAt.toISOString(),
      folder: m.folder ?? undefined,
    })),
    videoUrl: a.videoUrl ?? undefined,
    category: {
      id: a.category.id,
      slug: a.category.slug as CategorySlug,
      name: a.category.name,
      description: a.category.description ?? "",
      color: a.category.color ?? undefined,
    },
    tags: a.tags.map((t) => ({ id: t.id, slug: t.slug, name: t.name })),
    author: {
      id: a.author.id,
      slug: a.author.email.split("@")[0],
      name: a.author.name,
      title: a.author.title ?? "",
      bio: a.author.bio ?? "",
      avatarUrl: a.author.avatarUrl ?? "",
      twitter: a.author.twitter ?? undefined,
    },
    status: STATUS_TO_SITE[a.status],
    type: a.type,
    featured: a.featured,
    trending: a.trending,
    sponsored: a.sponsored,
    publishedAt: (a.publishedAt ?? a.createdAt).toISOString(),
    scheduledFor: a.scheduledFor?.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    readTimeMinutes: a.readTimeMinutes,
    views: a.views,
    seo: {
      metaTitle: a.metaTitle ?? undefined,
      metaDescription: a.metaDescription ?? undefined,
      canonicalUrl: a.canonicalUrl ?? undefined,
      ogImage: a.ogImage ?? undefined,
      noIndex: a.noIndex,
    },
  };
}

const includeRelations = {
  category: true,
  author: true,
  tags: true,
  coverImage: true,
  gallery: true,
} as const;

export interface SearchArticlesQuery {
  q?: string;
  category?: string;
  from?: string;
  to?: string;
  limit?: number;
}

export async function searchArticlesDb(
  query: SearchArticlesQuery
): Promise<{ items: Article[]; total: number }> {
  const { q, category, from, to, limit = 30 } = query;

  const where = {
    status: "PUBLISHED" as const,
    type: "NEWS" as const,
    ...(category ? { category: { slug: category } } : {}),
    ...(from || to
      ? {
          publishedAt: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(to) } : {}),
          },
        }
      : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { dek: { contains: q, mode: "insensitive" as const } },
            { tags: { some: { name: { contains: q, mode: "insensitive" as const } } } },
          ],
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      include: includeRelations,
      orderBy: { publishedAt: "desc" },
      take: limit,
    }),
  ]);

  return { items: rows.map(mapArticle), total };
}

export async function queryArticlesDb(
  query: RepoArticleQuery = {}
): Promise<ArticleListResult> {
  const {
    category,
    tag,
    featured,
    trending,
    q,
    page = 1,
    pageSize = 12,
  } = query;

  const where = {
    status: "PUBLISHED" as const,
    type: "NEWS" as const,
    ...(category ? { category: { slug: category } } : {}),
    ...(tag ? { tags: { some: { slug: tag } } } : {}),
    ...(featured ? { featured: true } : {}),
    ...(trending ? { trending: true } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { dek: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      include: includeRelations,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    items: rows.map(mapArticle),
    total,
    page,
    pageSize,
    hasMore: (page - 1) * pageSize + rows.length < total,
  };
}

export async function getArticleWithRelatedDb(
  slug: string
): Promise<{ article: Article; related: Article[] } | null> {
  const row = await prisma.article.findFirst({
    where: { slug, type: "NEWS", status: "PUBLISHED" },
    include: includeRelations,
  });
  if (!row) return null;

  const relatedRows = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      type: "NEWS",
      categoryId: row.categoryId,
      id: { not: row.id },
    },
    include: includeRelations,
    orderBy: { publishedAt: "desc" },
    take: 4,
  });

  return { article: mapArticle(row), related: relatedRows.map(mapArticle) };
}

/** Public /blog listing — published blog posts only, newest first. */
export async function getBlogArticlesDb(
  query: { page?: number; pageSize?: number } = {}
): Promise<ArticleListResult> {
  const { page = 1, pageSize = 24 } = query;

  const where = { status: "PUBLISHED" as const, type: "BLOG" as const };

  const [total, rows] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      include: includeRelations,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    items: rows.map(mapArticle),
    total,
    page,
    pageSize,
    hasMore: (page - 1) * pageSize + rows.length < total,
  };
}

/** Public /blog/[slug] page — a single published blog post plus related posts. */
export async function getBlogArticleWithRelatedDb(
  slug: string
): Promise<{ article: Article; related: Article[] } | null> {
  const row = await prisma.article.findFirst({
    where: { slug, type: "BLOG", status: "PUBLISHED" },
    include: includeRelations,
  });
  if (!row) return null;

  const relatedRows = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      type: "BLOG",
      categoryId: row.categoryId,
      id: { not: row.id },
    },
    include: includeRelations,
    orderBy: { publishedAt: "desc" },
    take: 4,
  });

  return { article: mapArticle(row), related: relatedRows.map(mapArticle) };
}

/** Admin table view — every status, newest edits first. */
export async function listAllArticlesDb(): Promise<Article[]> {
  const rows = await prisma.article.findMany({
    include: includeRelations,
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(mapArticle);
}

/** Admin edit page — lookup by id (not slug) since that's what the URL uses. */
export async function getArticleByIdDb(id: string): Promise<Article | null> {
  const row = await prisma.article.findUnique({
    where: { id },
    include: includeRelations,
  });
  return row ? mapArticle(row) : null;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base || `story-${Date.now()}`;
  let suffix = 1;
  while (await prisma.article.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
  return slug;
}

// Admin editor writes are attributed to a standing "Site Admin" account
// until the admin panel has real user accounts/auth.
const ADMIN_AUTHOR_EMAIL = "admin@scooproomhq.com";
async function ensureAdminAuthor() {
  return prisma.user.upsert({
    where: { email: ADMIN_AUTHOR_EMAIL },
    update: {},
    create: {
      email: ADMIN_AUTHOR_EMAIL,
      name: "Scoop Room Editorial",
      passwordHash: "disabled:admin-panel",
      role: "EDITOR",
    },
  });
}

export async function createArticleDb(
  input: ArticleDraftInput
): Promise<{ id: string }> {
  const category = await prisma.category.findUnique({
    where: { slug: input.categorySlug },
  });
  if (!category) {
    throw new Error(`Unknown category slug: ${input.categorySlug}`);
  }
  const author = await ensureAdminAuthor();
  const slug = await uniqueSlug(slugify(input.title));

  const tagConnections = await Promise.all(
    input.tagSlugs.map((s) =>
      prisma.tag.upsert({ where: { slug: s }, update: {}, create: { slug: s, name: s } })
    )
  );

  let coverImageId: string | undefined;
  if (input.coverImage) {
    const media = await prisma.mediaAsset.create({
      data: { type: "IMAGE", url: input.coverImage, alt: input.title },
    });
    coverImageId = media.id;
  }

  const article = await prisma.article.create({
    data: {
      slug,
      title: input.title,
      dek: input.dek,
      excerpt: input.dek,
      content: input.content,
      categoryId: category.id,
      authorId: author.id,
      status: STATUS_TO_DB[input.status],
      featured: input.featured ?? false,
      publishedAt: input.status === "published" ? new Date() : null,
      scheduledFor: input.scheduledFor ? new Date(input.scheduledFor) : null,
      metaTitle: input.seo?.metaTitle,
      metaDescription: input.seo?.metaDescription,
      coverImageId,
      tags: { connect: tagConnections.map((t) => ({ id: t.id })) },
    },
  });

  return { id: article.id };
}

export async function updateArticleDb(
  id: string,
  input: Partial<ArticleDraftInput>
): Promise<{ success: true }> {
  const data: Record<string, unknown> = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.dek !== undefined) {
    data.dek = input.dek;
    data.excerpt = input.dek;
  }
  if (input.content !== undefined) data.content = input.content;
  if (input.featured !== undefined) data.featured = input.featured;
  if (input.status !== undefined) {
    data.status = STATUS_TO_DB[input.status];
    if (input.status === "published") data.publishedAt = new Date();
  }
  if (input.scheduledFor !== undefined) {
    data.scheduledFor = input.scheduledFor ? new Date(input.scheduledFor) : null;
  }
  if (input.seo?.metaTitle !== undefined) data.metaTitle = input.seo.metaTitle;
  if (input.seo?.metaDescription !== undefined) data.metaDescription = input.seo.metaDescription;

  if (input.coverImage) {
    const media = await prisma.mediaAsset.create({
      data: { type: "IMAGE", url: input.coverImage, alt: input.title ?? "Cover image" },
    });
    data.coverImageId = media.id;
  }

  if (input.categorySlug) {
    const category = await prisma.category.findUnique({ where: { slug: input.categorySlug } });
    if (!category) throw new Error(`Unknown category slug: ${input.categorySlug}`);
    data.categoryId = category.id;
  }

  if (input.tagSlugs) {
    const tagConnections = await Promise.all(
      input.tagSlugs.map((s) =>
        prisma.tag.upsert({ where: { slug: s }, update: {}, create: { slug: s, name: s } })
      )
    );
    data.tags = { set: tagConnections.map((t) => ({ id: t.id })) };
  }

  await prisma.article.update({ where: { id }, data });
  return { success: true };
}

export async function deleteArticleDb(id: string): Promise<{ success: true }> {
  await prisma.article.delete({ where: { id } });
  return { success: true };
}