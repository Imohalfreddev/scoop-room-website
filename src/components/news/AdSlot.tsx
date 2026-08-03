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
 * SIZING: each placement is locked to an IAB-standard aspect ratio (not a
 * fixed pixel height) via `getSlotSizing` below, capped with a max-width so
 * creative never scales up past its native resolution. Because the empty
 * placeholder and the loaded slide both pull from that same function, the
 * box is *always* the same shape — swapping a placeholder out for a real ad
 * never shifts layout (the old fixed-height version could change shape
 * between states, which is a CLS/layout-shift bug). The aspect-ratio also
 * makes the box correctly responsive inside any container width, not just
 * at breakpoints — a narrow sidebar and a full-width hero both resolve to
 * the right shape automatically.
 *
 * For a leaderboard slot specifically, export creative at the matching IAB
 * size for best results (320x50 mobile, 468x60 small, 728x90 desktop,
 * 970x90 large desktop). The image uses object-cover, so it always fills
 * the slot edge-to-edge with no empty space — if the source creative's
 * ratio doesn't exactly match the slot's ratio, the excess is cropped
 * (centered) rather than shrunk down with gutters on the sides.
 */

type Sizing = { ratio: string; maxWidth: string };

function getSlotSizing(placement: AdSlotConfig["placement"]): Sizing {
  if (placement === "leaderboard") {
    // IAB leaderboard sizes: 320x50 (mobile) -> 468x60 -> 728x90 -> 970x90
    return {
      ratio:
        "aspect-[320/50] sm:aspect-[468/60] lg:aspect-[728/90] xl:aspect-[970/90]",
      maxWidth: "max-w-[320px] sm:max-w-[468px] lg:max-w-[728px] xl:max-w-[970px]",
    };
  }
  if (placement === "in-article") {
    // 300x250 and 336x280 (IAB medium/large rectangle) share a 6:5 ratio,
    // so a single aspect class covers both sizes — only max-width grows.
    return {
      ratio: "aspect-[300/250]",
      maxWidth: "max-w-[300px] sm:max-w-[336px]",
    };
  }
  if (placement === "sponsored-post") {
    // Native/content-card style unit — landscape thumbnail ratio.
    return {
      ratio: "aspect-[16/9]",
      maxWidth: "max-w-[480px] sm:max-w-[600px]",
    };
  }
  // Fallback: IAB square (250x250) / large square (300x300)
  return {
    ratio: "aspect-square",
    maxWidth: "max-w-[250px] sm:max-w-[300px]",
  };
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
  const slides = configs.filter((c) => c.imageUrl);
  const { ratio, maxWidth } = getSlotSizing(placement);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    // Respect prefers-reduced-motion: don't auto-rotate for users who've
    // asked their OS/browser to minimize motion.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
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

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  if (slides.length === 0) {
    return (
      <div
        className={cn(
          "mx-auto flex w-full flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border bg-surface text-muted",
          ratio,
          maxWidth,
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

  // Fallback to the first slide if index is transiently out of range
  // (e.g. one render between slides shrinking and the reset effect firing).
  const current = slides[index] ?? slides[0];

  return (
    <div
      role="group"
      aria-label="Advertisement"
      className={cn(
        "relative mx-auto flex w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface",
        ratio,
        maxWidth,
        className
      )}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <a
        href={current.href ?? "#"}
        rel="sponsored noopener noreferrer"
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
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
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
              aria-current={i === index}
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