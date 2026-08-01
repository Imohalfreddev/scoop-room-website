import { NextRequest, NextResponse } from "next/server";
import { USE_MOCK_API } from "@/lib/api/config";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const endpoint = body?.endpoint as string | undefined;
  const p256dh = body?.keys?.p256dh as string | undefined;
  const auth = body?.keys?.auth as string | undefined;

  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  if (USE_MOCK_API) {
    // Nothing to persist in the standalone demo.
    return NextResponse.json({ success: true });
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { p256dh, auth },
      create: { endpoint, p256dh, auth },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save subscription" },
      { status: 500 }
    );
  }
}
