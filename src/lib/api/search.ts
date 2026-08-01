import { apiFetch } from "./config";
import type { SearchResult } from "@/types";

export interface SearchQuery {
  q: string;
  category?: string;
  from?: string;
  to?: string;
}

export async function searchArticles(query: SearchQuery): Promise<SearchResult> {
  const params = new URLSearchParams();
  params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);

  return apiFetch<SearchResult>(`/api/search?${params.toString()}`, {
    next: { revalidate: 0 },
  });
}
