import { NextRequest, NextResponse } from "next/server";
import { getArticleWithRelated } from "@/lib/repository/articles";
import { getArticleWithRelatedDb } from "@/lib/repository/articles.db";
import { USE_MOCK_API } from "@/lib/api/config";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const result = USE_MOCK_API
    ? getArticleWithRelated(slug)
    : await getArticleWithRelatedDb(slug);

  if (!result) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
