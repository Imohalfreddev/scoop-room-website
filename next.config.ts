import type { NextConfig } from "next";

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
    // user-uploaded files.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Bot-sourced articles pull cover images from whichever publisher a
    // story came from (dozens of different news sites, and the trusted
    // source list can grow over time), so a fixed per-domain allow-list
    // isn't practical here — allow any https host instead.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;