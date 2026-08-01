import type { MetadataRoute } from "next";
import { site } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/bookmarks", "/search"],
      },
      {
        userAgent: "Googlebot-News",
        allow: "/article",
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
