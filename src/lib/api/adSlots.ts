import { USE_MOCK_API } from "./config";
import type { AdSlotConfig } from "@/types";

/**
 * Returns every active ad config for a placement (AdSlot rotates through
 * them). Empty array means AdSlot renders its house placeholder — nothing
 * ever breaks the layout.
 * Server Components only: reads Prisma directly rather than round-tripping
 * through this app's own API.
 */
export async function getAdSlotConfigs(
  placement: AdSlotConfig["placement"]
): Promise<AdSlotConfig[]> {
  if (USE_MOCK_API) return [];

  const { prisma } = await import("@/lib/db/prisma");
  const rows = await prisma.adSlotConfig.findMany({
    where: { placement, active: true },
    orderBy: { id: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    placement: row.placement as AdSlotConfig["placement"],
    label: row.label,
    images: row.images,
    href: row.href ?? undefined,
    advertiser: row.advertiser ?? undefined,
    active: row.active,
  }));
}