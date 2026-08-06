import { articles } from "@/lib/mock/articles";
import { site } from "@/lib/constants";
import { USE_MOCK_API } from "@/lib/api/config";

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface FeedItem {
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  categoryName: string;
  authorName: string;
}

async function getFeedItems(): Promise<FeedItem[]> {
  if (!USE_MOCK_API) {
    const { prisma } = await import("@/lib/db/prisma");
    const rows = await prisma.article.findMany({
      where: { status: "PUBLISHED", type: "NEWS" },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        createdAt: true,
        category: { select: { name: true } },
        author: { select: { name: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 50,
    });
    return rows.map((a) => ({
      title: a.title,
      slug: a.slug,
      publishedAt: (a.publishedAt ?? a.createdAt).toISOString(),
      excerpt: a.excerpt,
      categoryName: a.category.name,
      authorName: a.author.name,
    }));
  }
  return articles.slice(0, 50).map((a) => ({
    title: a.title,
    slug: a.slug,
    publishedAt: a.publishedAt,
    excerpt: a.excerpt,
    categoryName: a.category.name,
    authorName: a.author.name,
  }));
}

export async function GET() {
  const feedItems = await getFeedItems();
  const items = feedItems
    .map(
      (a) => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${site.url}/article/${a.slug}</link>
      <guid isPermaLink="true">${site.url}/article/${a.slug}</guid>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(a.excerpt)}</description>
      <category>${escapeXml(a.categoryName)}</category>
      <author>${escapeXml(a.authorName)}</author>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${site.name}</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.description)}</description>
    <language>en-us</language>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
    },
  });
}
