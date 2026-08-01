import type { Metadata } from "next";
import { SearchPageClient } from "@/components/search/SearchPageClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Scoop Room for the latest news, analysis, and stories.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string }>;
}) {
  const params = await searchParams;
  return (
    <SearchPageClient
      initialQuery={params.q ?? params.tag ?? ""}
      initialCategory={params.category ?? ""}
    />
  );
}
