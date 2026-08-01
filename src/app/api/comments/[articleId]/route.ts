import { NextRequest, NextResponse } from "next/server";
import type { Comment } from "@/types";
import { USE_MOCK_API } from "@/lib/api/config";

// Mock-mode only — resets on redeploy, which is fine since it's just the
// standalone demo. Live mode below persists to Postgres.
const store: Record<string, Comment[]> = {};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const { articleId } = await params;

  if (!USE_MOCK_API) {
    const { listCommentsDb } = await import("@/lib/repository/comments.db");
    return NextResponse.json({ items: await listCommentsDb(articleId) });
  }

  return NextResponse.json({ items: store[articleId] ?? [] });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const { articleId } = await params;
  const body = await req.json().catch(() => null);

  const authorName = typeof body?.authorName === "string" ? body.authorName.trim() : "";
  const commentBody = typeof body?.body === "string" ? body.body.trim() : "";

  if (!authorName || !commentBody) {
    return NextResponse.json({ error: "Missing comment fields" }, { status: 400 });
  }
  if (authorName.length > 80 || commentBody.length > 2000) {
    return NextResponse.json({ error: "Comment is too long" }, { status: 400 });
  }

  if (!USE_MOCK_API) {
    try {
      const { createCommentDb } = await import("@/lib/repository/comments.db");
      const comment = await createCommentDb(articleId, { authorName, body: commentBody });
      return NextResponse.json({ comment }, { status: 201 });
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Failed to save comment" },
        { status: 500 }
      );
    }
  }

  const comment: Comment = {
    id: `comment_${Date.now()}`,
    articleId,
    authorName,
    body: commentBody,
    createdAt: new Date().toISOString(),
  };
  store[articleId] = [...(store[articleId] ?? []), comment];
  return NextResponse.json({ comment }, { status: 201 });
}
