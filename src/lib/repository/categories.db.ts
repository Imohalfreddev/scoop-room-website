import { prisma } from "@/lib/db/prisma";
import type { Category } from "@/types";

export async function listCategoriesDb(): Promise<Category[]> {
  const rows = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug as Category["slug"],
    name: r.name,
    description: r.description ?? "",
    color: r.color ?? undefined,
  }));
}

export async function getCategoryBySlugDb(slug: string): Promise<Category | null> {
  const row = await prisma.category.findUnique({ where: { slug } });
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug as Category["slug"],
    name: row.name,
    description: row.description ?? "",
    color: row.color ?? undefined,
  };
}
