"use client";

import { useEffect, useState } from "react";
import type { AdSlotConfig } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Renders an ad placement, auto-rotating through every active config passed
 * in. In this standalone build it shows a brand-consistent house
 * placeholder when there's nothing to show, so layout and spacing stay
 * correct end-to-end. To go live with Google AdSense:
 *
 *   1. Add NEXT_PUBLIC_ADSENSE_CLIENT_ID to .env
 *   2. Load the AdSense script once in the root layout
 *   3. Replace the placeholder <div> below with an <ins class="adsbygoogle">
 *      block for the given `placement`, keeping the same wrapper sizing.
 *
 * Sponsored posts and affiliate placements can reuse this same component
 * by passing `configs` with an image + href per slide.
 *
 * Sizing uses aspect-ratio (not a fixed height) so arbitrary ad creative —
 * square, portrait, or wide banner — always displays in full via
 * object-contain rather than getting cropped by object-cover.
 */
export function AdSlot({
  placement,
  configs = [],
  className,
  rotateMs = 6000,
}: {
  placement: AdSlotConfig["placement"];
  configs?: AdSlotConfig[];
  className?: string;
  rotateMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slides = configs.filter((c) => c.imageUrl);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, rotateMs);
    return () => clearInterval(timer);
  }, [slides.length, paused, rotateMs]);

  // Reset to the first slide if the slide count changes (e.g. new ads
  // loaded) so `index` never points past the end of a shorter array.
  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  const aspect =
    placement === "leaderboard"
      ? "aspect-[4/1] sm:aspect-[6/1]"
      : placement === "in-article"
        ? "aspect-[3/1] sm:aspect-[4/1]"
        : placement === "sponsored-post"
          ? "aspect-[16/9]"
          : "aspect-square";

  if (slides.length === 0) {
    return (
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border bg-surface text-muted",
          aspect,
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

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-border bg-surface",
        aspect,
        className
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <a
          key={slide.id}
          href={slide.href ?? "#"}
          rel="sponsored noopener"
          target="_blank"
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-700",
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          aria-hidden={i !== index}
          tabIndex={i === index ? 0 : -1}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.imageUrl}
            alt={slide.advertiser ?? "Sponsored"}
            className="size-full object-contain"
          />
        </a>
      ))}

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ad ${i + 1} of ${slides.length}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-4 bg-signal" : "w-1.5 bg-foreground/30"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}