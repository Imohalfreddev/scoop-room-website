import { articles } from "@/lib/mock/articles";
import { site } from "@/lib/constants";
import { USE_MOCK_API } from "@/lib/api/config";

// Google News only wants articles published within roughly the last 48
// hours in this sitemap — it's a "what's fresh right now" feed, separate
// from the full sitemap.xml which lists everything permanently.
const NEWS_WINDOW_MS = 48 * 60 * 60 * 1000;

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface NewsItem {
  title: string;
  slug: string;
  publishedAt: string;
}

async function getRecentNewsItems(): Promise<NewsItem[]> {
  const since = new Date(Date.now() - NEWS_WINDOW_MS);

  if (!USE_MOCK_API) {
    const { prisma } = await import("@/lib/db/prisma");
    const rows = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        type: "NEWS",
        publishedAt: { gte: since },
      },
      select: { title: true, slug: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });
    return rows
      .filter((a) => a.publishedAt !== null)
      .map((a) => ({
        title: a.title,
        slug: a.slug,
        publishedAt: a.publishedAt!.toISOString(),
      }));
  }

  return articles
    .filter((a) => new Date(a.publishedAt) >= since)
    .map((a) => ({ title: a.title, slug: a.slug, publishedAt: a.publishedAt }));
}

export async function GET() {
  const items = await getRecentNewsItems();

  const urls = items
    .map(
      (a) => `
  <url>
    <loc>${site.url}/article/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(site.name)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(a.publishedAt).toISOString()}</news:publication_date>
      <news:title>${escapeXml(a.title)}</news:title>
    </news:news>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Short cache — Google's news crawler checks this frequently and it
      // needs to reflect what's published in roughly real time.
      "Cache-Control": "public, max-age=180, stale-while-revalidate=600",
    },
  });
}
