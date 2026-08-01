import { USE_MOCK_API } from "./config";
import type { AdSlotConfig } from "@/types";

/**
 * Returns the active ad config for a placement, or undefined (AdSlot then
 * renders its house placeholder — nothing ever breaks the layout).
 * Server Components only: reads Prisma directly rather than round-tripping
 * through this app's own API.
 */
export async function getAdSlotConfig(
  placement: AdSlotConfig["placement"]
): Promise<AdSlotConfig | undefined> {
  if (USE_MOCK_API) return undefined;

  const { prisma } = await import("@/lib/db/prisma");
  const row = await prisma.adSlotConfig.findFirst({
    where: { placement, active: true },
    orderBy: { id: "desc" },
  });
  if (!row) return undefined;

  return {
    id: row.id,
    placement: row.placement as AdSlotConfig["placement"],
    label: row.label,
    imageUrl: row.imageUrl ?? undefined,
    href: row.href ?? undefined,
    advertiser: row.advertiser ?? undefined,
    active: row.active,
  };
}
