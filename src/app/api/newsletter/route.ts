import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { USE_MOCK_API } from "@/lib/api/config";

const schema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

// Mock-mode only — resets on redeploy, fine for the standalone demo.
const subscribers: { email: string; subscribedAt: string; source?: string }[] = [];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  const { email, source } = parsed.data;

  if (!USE_MOCK_API) {
    try {
      const { subscribeDb } = await import("@/lib/repository/newsletter.db");
      const result = await subscribeDb(email, source);
      return NextResponse.json({ success: true, email: result.email });
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Failed to subscribe" },
        { status: 500 }
      );
    }
  }

  if (!subscribers.some((s) => s.email === email)) {
    subscribers.push({ email, subscribedAt: new Date().toISOString(), source });
  }
  return NextResponse.json({ success: true, email });
}
