import type { Author } from "@/types";

const rawAuthors: Omit<Author, "avatarUrl">[] = [
  {
    id: "auth_amaka",
    slug: "amaka-eze",
    name: "Amaka Eze",
    title: "Senior Political Correspondent",
    bio: "Amaka covers Nigerian politics and policy from the National Assembly press gallery, with a decade of experience reporting on governance across West Africa.",
    twitter: "@amakaeze",
  },
  {
    id: "auth_tunde",
    slug: "tunde-bakare",
    name: "Tunde Bakare",
    title: "Business Editor",
    bio: "Tunde leads Scoop Room's markets and business desk, focused on African fintech, energy, and macroeconomic policy.",
    twitter: "@tundeb",
  },
  {
    id: "auth_zainab",
    slug: "zainab-suleiman",
    name: "Zainab Suleiman",
    title: "Technology Reporter",
    bio: "Zainab reports on startups, AI, and the digital economy across Nigeria and the continent.",
    twitter: "@zainabs",
  },
  {
    id: "auth_femi",
    slug: "femi-adeyemi",
    name: "Femi Adeyemi",
    title: "Sports Correspondent",
    bio: "Femi has covered African football and the Super Eagles for over eight years, from qualifiers to continental finals.",
  },
  {
    id: "auth_chiamaka",
    slug: "chiamaka-obi",
    name: "Chiamaka Obi",
    title: "Culture & Entertainment Editor",
    bio: "Chiamaka writes on Nollywood, Afrobeats, and the creative economy for Scoop Room.",
  },
  {
    id: "auth_daniel",
    slug: "daniel-okoro",
    name: "Daniel Okoro",
    title: "World Affairs Editor",
    bio: "Daniel oversees Scoop Room's international desk, coordinating coverage from correspondents across four continents.",
  },
  {
    id: "auth_ngozi",
    slug: "ngozi-chukwu",
    name: "Ngozi Chukwu",
    title: "Lifestyle Editor",
    bio: "Ngozi covers health, travel, and culture with a focus on stories that shape everyday life.",
  },
];

export const authors: Author[] = rawAuthors.map((a) => ({
  ...a,
  avatarUrl: `/api/avatar/${a.slug}?name=${encodeURIComponent(a.name)}`,
}));

export const authorBySlug = (slug: string) =>
  authors.find((a) => a.slug === slug);
