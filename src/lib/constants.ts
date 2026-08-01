import type { CategorySlug } from "@/types";

export const site = {
  name: "Scoop Room",
  tagline: "The People's Stories. Told With Integrity.",
  description:
    "Scoop Room is a global newsroom covering Nigeria, Africa, and the world — politics, business, technology, and culture, reported fast and verified first.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  twitter: "@scooproom",
  locale: "en_US",
};

export const primaryNav: { label: string; slug: CategorySlug }[] = [
  { label: "Nigeria", slug: "nigeria" },
  { label: "Africa", slug: "africa" },
  { label: "World", slug: "world" },
  { label: "Politics", slug: "politics" },
  { label: "Business", slug: "business" },
  { label: "Technology", slug: "technology" },
  { label: "Entertainment", slug: "entertainment" },
  { label: "Sports", slug: "sports" },
  { label: "Lifestyle", slug: "lifestyle" },
  { label: "AI", slug: "ai" },
];

export const footerLinks = {
  Sections: primaryNav,
  Company: [
    { label: "About Scoop Room", href: "/about" },
    { label: "Newsroom Ethics", href: "/ethics" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Blog", href: "/blog" },
    { label: "Advertise", href: "/advertise" },
    { label: "RSS Feed", href: "/feed.xml" },
    { label: "Sitemap", href: "/sitemap.xml" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};
