/**
 * Central switch between "standalone mock mode" and the real database.
 *
 * NEXT_PUBLIC_USE_MOCK_API=true (default) — every function in
 * src/lib/api/* reads from src/lib/mock/* and from this app's own
 * /api/* route handlers, which shape their responses to match the
 * Article / Category / etc. types in src/types/index.ts exactly.
 *
 * NEXT_PUBLIC_USE_MOCK_API=false — those same /api/* route handlers read
 * and write via Prisma (src/lib/db/prisma.ts, src/lib/repository/*.db.ts)
 * against DATABASE_URL. There's no separate external API to point at —
 * this app, the admin app, and the Telegram bot all talk to the same
 * Postgres database directly.
 */

export const USE_MOCK_API =
  process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

// Base URL for this app's own local API routes.
export const LOCAL_API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

/**
 * Shared fetch wrapper. Every service function should go through this so
 * that adding auth headers or retry logic later only has to happen in one
 * place.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith("http") ? path : `${LOCAL_API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    // Local routes can be cached at the edge; swap per-route as needed.
    next: init && "next" in init ? init.next : { revalidate: 60 },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.error || `Request to ${url} failed`, res.status);
  }
  return res.json() as Promise<T>;
}
