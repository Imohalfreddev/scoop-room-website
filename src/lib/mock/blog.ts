import type { Article } from "@/types";
import { categoryBySlug } from "./categories";
import { authors } from "./authors";
import { pickTags } from "./tags";

interface BlogSeed {
  title: string;
  dek: string;
  categorySlug: Parameters<typeof categoryBySlug>[0];
}

const blogSeeds: BlogSeed[] = [
  {
    title: "Why Africa's Startup Funding Is Shifting From Lagos to Nairobi",
    dek: "A look at the capital flows reshaping the continent's tech scene.",
    categorySlug: "technology",
  },
  {
    title: "The Quiet Return of Vinyl Culture in Lagos",
    dek: "A new generation is rediscovering physical music through independent record shops.",
    categorySlug: "lifestyle",
  },
  {
    title: "What the New Minimum Wage Actually Means for Households",
    dek: "Breaking down the numbers behind the headline policy change.",
    categorySlug: "business",
  },
  {
    title: "Inside the Newsroom: How We Fact-Check Breaking Stories",
    dek: "A behind-the-scenes look at Scoop Room's verification process.",
    categorySlug: "ai",
  },
  {
    title: "The Case for Slower Travel Across West Africa",
    dek: "Overland routes are proving more rewarding than the next quick flight.",
    categorySlug: "lifestyle",
  },
  {
    title: "Five Charts That Explain the Naira's Year So Far",
    dek: "A data-driven look at currency moves and what's been driving them.",
    categorySlug: "business",
  },
];

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const blogPosts: Article[] = blogSeeds.map((seed, index) => {
  const slug = slugify(seed.title);
  const h = hashCode(slug);
  const category = categoryBySlug(seed.categorySlug)!;
  const author = authors[h % authors.length];
  const publishedAt = new Date(Date.now() - index * 3 * 86400000).toISOString();
  const coverImage = `/api/placeholder/blog-${slug}?w=1600&h=1000&label=${encodeURIComponent(category.name)}`;

  return {
    id: `blog_${slug}`,
    slug,
    title: seed.title,
    dek: seed.dek,
    excerpt: seed.dek,
    content: `
      <p>${seed.dek} This piece draws on newsroom reporting, public data, and conversations with people close to the story to unpack what's really going on — and why it matters beyond the headlines.</p>
      <h2>The bigger picture</h2>
      <p>Context matters as much as the news itself. Scoop Room's opinion and analysis desk exists to slow down, connect the dots across our daily coverage, and offer a clearer view of where things are headed.</p>
      <h2>What to watch next</h2>
      <p>We'll continue tracking this story on our news desk as it develops, with deeper analysis here on the blog whenever the picture changes meaningfully.</p>
    `,
    coverImage,
    category,
    tags: pickTags(h, 3),
    author,
    status: "published",
    featured: false,
    trending: index < 2,
    publishedAt,
    updatedAt: publishedAt,
    readTimeMinutes: 6 + (h % 4),
    views: 500 + (h % 15000),
    seo: { metaTitle: seed.title, metaDescription: seed.dek, ogImage: coverImage },
  };
});

export const blogPostBySlug = (slug: string) => blogPosts.find((p) => p.slug === slug);

export const popularBlogPosts = [...blogPosts].sort((a, b) => b.views - a.views);

export const relatedBlogPosts = (post: Article, limit = 3) =>
  blogPosts.filter((p) => p.id !== post.id && p.category.id === post.category.id).slice(0, limit);
