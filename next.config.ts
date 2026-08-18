import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Lets `next dev` access Cloudflare bindings (R2, env vars, etc.) the same
// way the deployed Worker does. Only affects local dev — has no effect on
// the actual Cloudflare build/deploy.
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  images: {
    // Mock images are generated locally as SVGs via /api/placeholder and
    // /api/avatar (see src/lib/placeholder.ts) instead of being fetched
    // from a third party. Next's image optimizer rejects SVGs by default
    // (they can carry executable content), so this was returning 400s for
    // every single mock image. dangerouslyAllowSVG + a strict
    // contentSecurityPolicy is Next's documented safe pattern for this —
    // safe here because these SVGs are generated entirely server-side with
    // escaped input (see src/app/api/placeholder, src/app/api/avatar), not
    // user-uploaded files. This is only safe as long as remotePatterns
    // below stays a real allow-list and never wildcards arbitrary hosts —
    // see the note there.
    dangerouslyAllowSVG: true,
    // contentDispositionType isn't set here because Next's own default is
    // already "attachment" (forces download instead of inline render when
    // an image URL is opened directly) — no need to override it.
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Only hosts listed here get proxied through next/image's optimizer.
    // Bot-sourced article cover images come from dozens of arbitrary,
    // growing publisher domains that can't be enumerated in an allow-list
    // — wildcarding hostname here ("**") would turn this endpoint into an
    // open image proxy: anyone could make this server fetch and serve any
    // URL at your bandwidth/compute cost (a documented Next.js SSRF/abuse
    // pattern). Instead, those external images are rendered unoptimized —
    // see src/components/site/BrandImage.tsx, which auto-detects any src
    // whose host isn't in this list and skips the optimizer for it, so the
    // browser fetches it directly from the original publisher instead of
    // through this server.
    //
    // If your R2 bucket is served from a custom domain instead of the
    // default *.r2.dev public bucket URL, add that hostname here too (and
    // in src/components/site/BrandImage.tsx) — otherwise your own
    // uploaded images will still load fine, just without optimization.
    remotePatterns: [{ protocol: "https", hostname: "**.r2.dev" }],
  },
};

export default nextConfig;
