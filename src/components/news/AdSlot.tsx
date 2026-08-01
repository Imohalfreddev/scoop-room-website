import type { AdSlotConfig } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Renders a single ad placement. In this standalone build it shows a
 * brand-consistent house placeholder so layout and spacing are correct
 * end-to-end. To go live with Google AdSense:
 *
 *   1. Add NEXT_PUBLIC_ADSENSE_CLIENT_ID to .env
 *   2. Load the AdSense script once in the root layout
 *   3. Replace the placeholder <div> below with an <ins class="adsbygoogle">
 *      block for the given `placement`, keeping the same wrapper sizing.
 *
 * Sponsored posts and affiliate placements can reuse this same component
 * by passing a `config` with an image + href — see the `sponsored-post`
 * placement branch below.
 */
export function AdSlot({
  placement,
  config,
  className,
}: {
  placement: AdSlotConfig["placement"];
  config?: AdSlotConfig;
  className?: string;
}) {
  const sizing =
    placement === "leaderboard"
      ? "h-24 w-full"
      : placement === "in-article"
        ? "h-28 w-full"
        : placement === "sponsored-post"
          ? "h-40 w-full"
          : "h-64 w-full";

  if (config?.imageUrl) {
    return (
      <a
        href={config.href ?? "#"}
        rel="sponsored noopener"
        target="_blank"
        className={cn(
          "block overflow-hidden rounded-2xl border border-border",
          sizing,
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.imageUrl}
          alt={config.advertiser ?? "Sponsored"}
          className="size-full object-cover"
        />
      </a>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border bg-surface text-muted",
        sizing,
        className
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-widest">
        Advertisement
      </span>
      <span className="text-xs">{placement.replace("-", " ")} slot</span>
    </div>
  );
}
