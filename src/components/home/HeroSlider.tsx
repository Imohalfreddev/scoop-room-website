"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import type { Article } from "@/types";
import { CategoryPill } from "@/components/news/ArticleMeta";
import { timeAgo } from "@/lib/utils";

const SLIDE_DURATION = 7000;

export function HeroSlider({ articles }: { articles: Article[] }) {
  const slides = articles.slice(0, 5);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [sceneVisible, setSceneVisible] = useState(true);
  // Loaded via a plain client-side import() inside useEffect below, rather
  // than next/dynamic/React.lazy — this guarantees it only ever runs in the
  // browser (effects never run during SSR, so this can't crash server-side
  // on the WebGL/three.js code) without depending on next/dynamic's
  // internal default-export resolution, which is what was throwing
  // "received a promise that resolves to Module" here.
  const [HeroScene, setHeroScene] = useState<ComponentType<{ reducedMotion: boolean }> | null>(
    null
  );
  const reducedMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    let cancelled = false;
    import("@/components/three/HeroScene").then((mod) => {
      if (!cancelled) setHeroScene(() => mod.default);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // The WebGL scene runs a continuous 60fps render loop while mounted —
  // fine while it's the hero the user's actually looking at, wasteful (and
  // a real contributor to scroll jank, since it keeps competing for the
  // main thread) once they've scrolled well past it. Fully unmounting it
  // out of view stops that render loop completely, not just visually.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setSceneVisible(entry.isIntersecting),
      { rootMargin: "200px 0px" } // unmount a little before/after, not the instant it clips
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!slides.length) return null;
  const active = slides[index];

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[92svh] items-center overflow-hidden bg-ink text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Preloads only the next slide's photo (not all of them), so
          switching slides never has to wait on a fetch — without this,
          only the currently active slide's image had `priority`, so each
          new slide's photo started downloading the moment it became
          active, right when the crossfade needed it to already be there.
          That gap showed as the background/gradient with nothing on top
          until the fetch finished. */}
      <div className="hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={slides[(index + 1) % slides.length].id} src={slides[(index + 1) % slides.length].coverImage} alt="" />
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none opacity-90">
        {sceneVisible && HeroScene && <HeroScene reducedMotion={!!reducedMotion} />}
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-ink via-ink/40 to-ink/70 pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 pb-16 pt-28 sm:px-6 sm:pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="pointer-events-none">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
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
              </motion.div>
            </AnimatePresence>

            {/* Mobile/tablet cover image — the desktop side-card below is
                hidden until the `lg` breakpoint, so without this, phones
                and tablets never showed the article photo at all. */}
            <div className="pointer-events-auto relative mt-6 block lg:hidden">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  {/* Ken Burns: a slow continuous zoom for as long as this
                      slide is on screen (separate from the fade above, so
                      the two don't fight over the same scale value) — the
                      static photo reads as alive instead of just sitting
                      there. */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.06 }}
                    transition={{ duration: SLIDE_DURATION / 1000 + 1.5, ease: "linear" }}
                  >
                    <Image
                      src={active.coverImage}
                      alt={active.title}
                      fill
                      priority
                      sizes="100vw"
                      className="object-cover"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>

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
          </div>

          <div className="pointer-events-auto relative hidden lg:block">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.96, rotateY: 6 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_40px_120px_-30px_rgba(227,6,19,0.35)] backdrop-blur"
              >
                {/* Same slow continuous zoom as the mobile image above,
                    kept on its own inner element so it doesn't fight with
                    this card's entrance scale/rotateY animation. */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.06 }}
                  transition={{ duration: SLIDE_DURATION / 1000 + 1.5, ease: "linear" }}
                >
                  <Image
                    src={active.coverImage}
                    alt={active.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                </motion.div>
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