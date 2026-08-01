"use client";

import Link from "next/link";
import type { Article } from "@/types";

export function BreakingTicker({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  const loop = [...articles, ...articles];

  return (
    <div className="border-b border-border bg-ink text-white">
      <div className="mx-auto flex max-w-[1400px] items-stretch">
        <div className="flex shrink-0 items-center gap-2 border-r border-white/15 px-4 py-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-2 animate-wire-pulse rounded-full bg-signal-bright" />
            <span className="relative inline-flex size-2 rounded-full bg-signal-bright" />
          </span>
          <span className="font-mono text-[11px] font-semibold tracking-[0.18em] text-white">
            BREAKING
          </span>
        </div>
        <div className="no-scrollbar flex-1 overflow-hidden">
          <div className="flex w-max animate-marquee items-center py-2 hover:[animation-play-state:paused]">
            {loop.map((a, i) => (
              <Link
                key={`${a.id}-${i}`}
                href={`/article/${a.slug}`}
                className="flex items-center px-6 text-sm text-white/85 transition hover:text-white"
              >
                <span className="mr-6 text-white/30">•</span>
                {a.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
