"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import type { Article } from "@/types";
import { CategoryPill } from "@/components/news/ArticleMeta";
import { timeAgo } from "@/lib/utils";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

const SLIDE_DURATION = 7000;

export function HeroSlider({ articles }: { articles: Article[] }) {
  const slides = articles.slice(0, 5);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const reducedMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((i: number) => {
    setIndex((i + slides.length) % slides.length);
    setProgressKey((k) => k + 1);
  }, [slides.length]);

  useEffect(() => {
    if (paused || reducedMotion || slides.length <= 1) return;
    timerRef.current = setTimeout(() => goTo(index + 1), SLIDE_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, paused, reducedMotion, goTo, slides.length]);

  if (!slides.length) return null;
  const active = slides[index];

  return (
    <section
      className="relative isolate flex min-h-[92svh] items-center overflow-hidden bg-ink text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 z-0 pointer-events-none opacity-90">
        <HeroScene reducedMotion={!!reducedMotion} />
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-ink via-ink/40 to-ink/70 pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 pb-16 pt-28 sm:px-6 sm:pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="pointer-events-auto mb-5 flex items-center gap-3">
                  <CategoryPill name={active.category.name} slug={active.category.slug} />
                  <span
                    className="font-mono text-[11px] uppercase tracking-widest text-white/60"
                    suppressHydrationWarning
                  >
                    {timeAgo(active.publishedAt)}
                  </span>
                </div>
                <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  {active.title}
                </h1>
                <p className="mt-5 max-w-xl text-base text-white/75 sm:text-lg">
                  {active.dek}
                </p>
                <div className="pointer-events-auto mt-8 flex items-center gap-4">
                  <Link
                    href={`/article/${active.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-white transition hover:bg-signal-bright"
                  >
                    Read the full story <ArrowUpRight size={16} />
                  </Link>
                  <button
                    onClick={() => setPaused((p) => !p)}
                    aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
                    className="flex size-11 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:border-signal hover:text-signal"
                  >
                    {paused ? <Play size={16} /> : <Pause size={16} />}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pointer-events-auto relative hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.96, rotateY: 6 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_40px_120px_-30px_rgba(227,6,19,0.35)] backdrop-blur"
              >
                <Image
                  src={active.coverImage}
                  alt={active.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Wire-tick progress indicator — echoes the divider in the SR mark */}
        <div className="pointer-events-auto mt-14 flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}: ${s.title}`}
              className="group relative h-8 w-6 shrink-0"
            >
              <span className="absolute left-1/2 top-1/2 h-8 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 transition group-hover:bg-white/40" />
              {i === index && (
                <motion.span
                  key={progressKey}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: paused || reducedMotion ? 1 : 1 }}
                  transition={{
                    duration: paused || reducedMotion ? 0.2 : SLIDE_DURATION / 1000,
                    ease: "linear",
                  }}
                  style={{ transformOrigin: "bottom" }}
                  className="absolute left-1/2 top-1/2 h-8 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
