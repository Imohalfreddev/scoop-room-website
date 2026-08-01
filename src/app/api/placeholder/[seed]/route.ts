import { NextRequest } from "next/server";
import { seededGradient } from "@/lib/placeholder";

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * GET /api/placeholder/[seed]?w=1600&h=1000&label=Nigeria
 *
 * Generates a deterministic branded gradient placeholder — same seed always
 * produces the same image. This replaces an earlier version of the mock
 * dataset that pointed at https://picsum.photos, which intermittently
 * returns 403s when fetched server-side (Next's Image Optimizer proxies
 * remote images through the server, so a flaky third party breaks every
 * cover image on the site). Swap `coverImage` fields in src/lib/mock/* for
 * real CMS-uploaded URLs once the aggregator is connected — this route is
 * mock-mode only.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ seed: string }> }
) {
  const { seed } = await params;
  const { searchParams } = new URL(req.url);
  const w = Number(searchParams.get("w") ?? 1600);
  const h = Number(searchParams.get("h") ?? 1000);
  const label = escapeXml(searchParams.get("label") ?? "");
  const [from, to] = seededGradient(seed);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)" />
  <rect width="100%" height="100%" fill="url(#grid)" />
  ${
    label
      ? `<text x="50%" y="52%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(
          h * 0.045
        )}" font-weight="700" letter-spacing="4" fill="#ffffff" fill-opacity="0.85">${label.toUpperCase()}</text>`
      : ""
  }
</svg>`.trim();

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
