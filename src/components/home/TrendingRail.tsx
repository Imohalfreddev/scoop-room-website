"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Article } from "@/types";
import { SectionHeader } from "./SectionHeader";
import Link from "next/link";
import { BrandImage } from "@/components/site/BrandImage";
import { ArticleMeta } from "@/components/news/ArticleMeta";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "framer-motion";

// Mirrors HeroSlider's autoplay cadence/pattern (pause on hover, respects
// reduced motion) but advances the horizontal rail by one card instead of
// crossfading a single full-bleed slide — the rail's card-strip format
// doesn't suit a hard cut between slides the way the hero's single feature
// image does.
const SLIDE_INTERVAL = 4500;

export function TrendingRail({ articles }: { articles: Article[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  const scrollToIndex = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const wrapped = (i + articles.length) % articles.length;
    const card = track.children[wrapped] as HTMLElement | undefined;
    if (card) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    }
    setActiveIndex(wrapped);
  }, [articles.length]);

  useEffect(() => {
    if (paused || reducedMotion || articles.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % articles.length;
        scrollToIndex(next);
        return next;
      });
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [paused, reducedMotion, articles.length, scrollToIndex]);

  if (!articles.length) return null;

  return (
    <section
      className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <SectionHeader
        eyebrow="Right now"
        title="Trending"
        rightSlot={
          articles.length > 1 ? (
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex - 1)}
                aria-label="Previous trending story"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted transition hover:border-signal hover:text-signal"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex + 1)}
                aria-label="Next trending story"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted transition hover:border-signal hover:text-signal"
              >
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted transition hover:border-signal hover:text-signal"
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
              </button>
            </div>
          ) : undefined
        }
      />

      <div
        ref={trackRef}
        className="no-scrollbar -mx-4 flex gap-5 overflow-x-auto scroll-smooth px-4 pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {articles.map((a, i) => (
          <Link
            key={a.id}
            href={`/article/${a.slug}`}
            className="group relative w-[280px] shrink-0 overflow-hidden rounded-2xl bg-surface sm:w-[320px]"
            style={{ scrollSnapAlign: "start" }}
            onFocus={() => setActiveIndex(i)}
          >
            <div className="relative aspect-[4/3]">
              <BrandImage
                src={a.coverImage}
                alt={a.title}
                fill
                sizes="320px"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute left-4 top-4 font-display text-4xl font-bold text-white/90">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="line-clamp-2 text-[15px] font-semibold leading-snug text-white">
                  {a.title}
                </p>
                <ArticleMeta article={a} showAuthor={false} className="mt-2 text-white/70" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {articles.length > 1 && (
        <div className="mt-5 flex items-center gap-2 pl-1">
          {articles.map((a, i) => (
            <button
              key={a.id}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to trending story ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? "w-6 bg-signal" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
