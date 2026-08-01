import { prisma } from "@/lib/db/prisma";
import type { Comment } from "@/types";

export async function listCommentsDb(articleId: string): Promise<Comment[]> {
  const rows = await prisma.comment.findMany({
    where: { articleId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    articleId: r.articleId,
    authorName: r.authorName,
    authorAvatar: r.authorAvatar ?? undefined,
    body: r.body,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function createCommentDb(
  articleId: string,
  input: { authorName: string; body: string; authorAvatar?: string }
): Promise<Comment> {
  const row = await prisma.comment.create({
    data: {
      articleId,
      authorName: input.authorName,
      body: input.body,
      authorAvatar: input.authorAvatar,
    },
  });
  return {
    id: row.id,
    articleId: row.articleId,
    authorName: row.authorName,
    authorAvatar: row.authorAvatar ?? undefined,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
  };
}
