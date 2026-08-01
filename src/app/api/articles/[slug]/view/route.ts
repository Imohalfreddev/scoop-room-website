import { NextRequest, NextResponse } from "next/server";
import { USE_MOCK_API } from "@/lib/api/config";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (USE_MOCK_API) {
    // Nothing to persist in the standalone demo.
    return NextResponse.json({ success: true });
  }

  const { slug } = await params;
  try {
    const { prisma } = await import("@/lib/db/prisma");
    await prisma.article.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  } catch {
    // Article not found, or a race with a delete — never let this fail the
    // page for the reader.
  }
  return NextResponse.json({ success: true });
}
