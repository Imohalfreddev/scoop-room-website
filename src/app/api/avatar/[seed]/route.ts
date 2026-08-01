import { NextRequest } from "next/server";
import { seededGradient, initials } from "@/lib/placeholder";

/**
 * GET /api/avatar/[seed]?name=Amaka+Eze
 *
 * Deterministic initials avatar, generated server-side with no external
 * dependency (replaces an earlier version of the mock dataset that used
 * https://i.pravatar.cc, subject to the same third-party reliability risk
 * as picsum.photos — see src/app/api/placeholder).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ seed: string }> }
) {
  const { seed } = await params;
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") ?? seed;
  const size = Number(searchParams.get("size") ?? 200);
  const [from, to] = seededGradient(seed);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)" />
  <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, sans-serif" font-size="${Math.round(size * 0.38)}"
        font-weight="700" fill="#ffffff">${initials(name)}</text>
</svg>`.trim();

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
