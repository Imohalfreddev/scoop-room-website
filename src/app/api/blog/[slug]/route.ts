import { NextRequest, NextResponse } from "next/server";
import { blogPostBySlug, relatedBlogPosts } from "@/lib/mock/blog";
import { getBlogArticleWithRelatedDb } from "@/lib/repository/articles.db";
import { USE_MOCK_API } from "@/lib/api/config";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const result = USE_MOCK_API
    ? (() => {
        const article = blogPostBySlug(slug);
        return article ? { article, related: relatedBlogPosts(article) } : null;
      })()
    : await getBlogArticleWithRelatedDb(slug);

  if (!result) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
