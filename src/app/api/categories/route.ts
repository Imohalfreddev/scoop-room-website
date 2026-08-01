import { NextResponse } from "next/server";
import { categories } from "@/lib/mock/categories";
import { USE_MOCK_API } from "@/lib/api/config";

export async function GET() {
  if (!USE_MOCK_API) {
    const { listCategoriesDb } = await import("@/lib/repository/categories.db");
    return NextResponse.json({ items: await listCategoriesDb() });
  }
  return NextResponse.json({ items: categories });
}
