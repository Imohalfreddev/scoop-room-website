import { apiFetch } from "./config";
import type { Comment } from "@/types";

export async function getComments(articleId: string): Promise<Comment[]> {
  const { items } = await apiFetch<{ items: Comment[] }>(
    `/api/comments/${articleId}`,
    { next: { revalidate: 0 } }
  );
  return items;
}

export async function postComment(
  articleId: string,
  authorName: string,
  body: string
): Promise<Comment> {
  const { comment } = await apiFetch<{ comment: Comment }>(
    `/api/comments/${articleId}`,
    {
      method: "POST",
      body: JSON.stringify({ authorName, body }),
      next: { revalidate: 0 },
    }
  );
  return comment;
}
