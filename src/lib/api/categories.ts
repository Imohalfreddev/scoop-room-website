import { apiFetch, USE_MOCK_API } from "./config";
import type { Category } from "@/types";
import { categoryBySlug as mockCategoryBySlug } from "@/lib/mock/categories";

const isServer = () => typeof window === "undefined";

export async function getCategories(): Promise<Category[]> {
  if (isServer() && USE_MOCK_API) {
    const { categories } = await import("@/lib/mock/categories");
    return categories;
  }
  if (isServer() && !USE_MOCK_API) {
    const { listCategoriesDb } = await import("@/lib/repository/categories.db");
    return listCategoriesDb();
  }
  const { items } = await apiFetch<{ items: Category[] }>("/api/categories", {
    next: { revalidate: 3600 },
  });
  return items;
}

/**
 * Prefers the real DB row (so name/description edits made in the admin
 * app show up here), but falls back to the static definition if that
 * category hasn't been created in the database yet - the fixed set of
 * category slugs baked into navigation should never 404 a page.
 */
export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  if (!USE_MOCK_API) {
    const { getCategoryBySlugDb } = await import("@/lib/repository/categories.db");
    const dbCategory = await getCategoryBySlugDb(slug);
    if (dbCategory) return dbCategory;
  }
  return mockCategoryBySlug(slug);
}