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
 * Sizing: each placement gets a fixed height (not max-height — percentage
 * sizing on the image needs a real height to resolve against, or browsers
 * fall back to the image's natural size and overflow gets clipped). The
 * image itself uses object-contain within that box so it's never cropped —
 * an oddly-shaped creative (e.g. a near-square graphic in a wide leaderboard
 * slot) just shows smaller with empty space on the sides rather than being
 * cut off. For a leaderboard slot specifically, ad creative should ideally
 * be exported at roughly a 4:1 ratio (e.g. 1200x300px) so it fills the
 * width edge-to-edge — that's a design/export concern on the image itself,
 * not something CSS alone can solve for a square or portrait source image.
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
  const [visible, setVisible] = useState(true);
  const slides = configs.filter((c) => c.imageUrl);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % slides.length);
        setVisible(true);
      }, 300);
    }, rotateMs);
    return () => clearInterval(timer);
  }, [slides.length, paused, rotateMs]);

  // Reset to the first slide if the slide count changes (e.g. new ads
  // loaded) so `index` never points past the end of a shorter array.
  useEffect(() => {
    setIndex(0);
    setVisible(true);
  }, [slides.length]);

  // Scales up per breakpoint (mobile → tablet → desktop) so it looks
  // proportionate on every device, same as it already does on mobile.
  // Each value here is a real fixed height (not max-height) — that's what
  // avoids the top/bottom clipping bug from before, regardless of how many
  // breakpoints there are.
  const height =
    placement === "leaderboard"
      ? "h-20 sm:h-28 lg:h-32"
      : placement === "in-article"
        ? "h-24 sm:h-32 lg:h-36"
        : placement === "sponsored-post"
          ? "h-48 sm:h-56 lg:h-64"
          : "h-56 sm:h-64 lg:h-72";

  if (slides.length === 0) {
    const placeholderAspect =
      placement === "leaderboard"
        ? "aspect-[4/1] sm:aspect-[6/1]"
        : placement === "in-article"
          ? "aspect-[3/1] sm:aspect-[4/1]"
          : placement === "sponsored-post"
            ? "aspect-[16/9]"
            : "aspect-square";

    return (
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border bg-surface text-muted",
          placeholderAspect,
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

  const current = slides[index];

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface",
        height,
        className
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <a
        href={current.href ?? "#"}
        rel="sponsored noopener"
        target="_blank"
        className={cn(
          "flex h-full w-full items-center justify-center transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.imageUrl}
          alt={current.advertiser ?? "Sponsored"}
          className="h-full w-full object-contain"
        />
      </a>

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => {
                setVisible(false);
                setTimeout(() => {
                  setIndex(i);
                  setVisible(true);
                }, 300);
              }}
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