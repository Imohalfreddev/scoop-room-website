import type { Tag } from "@/types";

const names = [
  "Elections",
  "Economy",
  "Naira",
  "Startups",
  "Fintech",
  "Energy",
  "Climate",
  "Diplomacy",
  "Security",
  "Health",
  "Education",
  "Transfers",
  "Nollywood",
  "Afrobeats",
  "Policy",
  "Trade",
  "AI Safety",
  "Big Tech",
  "Infrastructure",
  "Aviation",
];

export const tags: Tag[] = names.map((name) => ({
  id: `tag_${name.toLowerCase().replace(/\s+/g, "-")}`,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
  name,
}));

export const tagBySlug = (slug: string) => tags.find((t) => t.slug === slug);

export function pickTags(seed: number, count = 3): Tag[] {
  const start = seed % tags.length;
  const out: Tag[] = [];
  for (let i = 0; i < count; i++) {
    out.push(tags[(start + i * 3) % tags.length]);
  }
  return out;
}
