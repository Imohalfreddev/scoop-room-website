"use client";

import { useEffect, useState } from "react";
import type { AdSlotConfig } from "@/types";
import { cn } from "@/lib/utils";
import { BRAND_PLACEHOLDER_SRC } from "@/components/site/BrandImage";

function onAdImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.src.endsWith(BRAND_PLACEHOLDER_SRC)) return;
  img.src = BRAND_PLACEHOLDER_SRC;
}

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
 * by passing `configs` with one or more images + an href per slide.
 *
 * Each ad config can hold several pictures (e.g. a rotating product
 * lineup for one advertiser). Every picture from every active config for
 * this placement is flattened into a single slide list, so a placement
 * with 2 ads of 3 pictures each auto-slides through all 6 in sequence,
 * keeping that picture's own click-through link and advertiser label.
 *
 * Sizing: the image displays at its natural aspect ratio, full width, with
 * object-contain so nothing ever gets cropped — but capped at a max height
 * per placement so an oddly-shaped creative (e.g. a near-square graphic in
 * a wide leaderboard slot) can't balloon the layout. For a leaderboard slot
 * specifically, ad creative should ideally be exported at roughly a 4:1
 * ratio (e.g. 1200x300px) so it fills the width without hitting that cap —
 * this is a design/export concern on the image itself, not something CSS
 * can fully solve for a square or portrait image.
 */
interface AdSlide {
  key: string;
  imageUrl: string;
  href?: string;
  advertiser?: string;
}

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
  const slides: AdSlide[] = configs.flatMap((c) =>
    c.images.map((imageUrl, i) => ({
      key: `${c.id}-${i}`,
      imageUrl,
      href: c.href,
      advertiser: c.advertiser,
    }))
  );

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

  const maxHeight =
    placement === "leaderboard"
      ? "max-h-32 sm:max-h-40"
      : placement === "in-article"
        ? "max-h-40 sm:max-h-52"
        : placement === "sponsored-post"
          ? "max-h-72"
          : "max-h-96";

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
        maxHeight,
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
          onError={onAdImgError}
          className="h-full w-full object-contain"
        />
      </a>

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.key}
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