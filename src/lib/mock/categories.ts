import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat_nigeria",
    slug: "nigeria",
    name: "Nigeria",
    description: "News from across the federation — Abuja, Lagos, and every state in between.",
  },
  {
    id: "cat_africa",
    slug: "africa",
    name: "Africa",
    description: "Continental affairs, regional blocs, and the stories shaping Africa.",
  },
  {
    id: "cat_world",
    slug: "world",
    name: "World",
    description: "Global reporting from the desks that matter.",
  },
  {
    id: "cat_politics",
    slug: "politics",
    name: "Politics",
    description: "Power, policy, and the people making the decisions.",
  },
  {
    id: "cat_business",
    slug: "business",
    name: "Business",
    description: "Markets, companies, and the economy in motion.",
  },
  {
    id: "cat_technology",
    slug: "technology",
    name: "Technology",
    description: "Products, platforms, and the engineers building what's next.",
  },
  {
    id: "cat_entertainment",
    slug: "entertainment",
    name: "Entertainment",
    description: "Film, music, and culture — on and off the screen.",
  },
  {
    id: "cat_sports",
    slug: "sports",
    name: "Sports",
    description: "Results, transfers, and the moments fans replay.",
  },
  {
    id: "cat_lifestyle",
    slug: "lifestyle",
    name: "Lifestyle",
    description: "Health, travel, food, and how people are living now.",
  },
  {
    id: "cat_ai",
    slug: "ai",
    name: "AI",
    description: "Artificial intelligence, the labs building it, and its real-world impact.",
  },
];

export const categoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);
