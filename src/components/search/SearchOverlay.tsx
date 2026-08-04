"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BrandImage } from "@/components/site/BrandImage";
import { Search, X, TrendingUp } from "lucide-react";
import type { Article } from "@/types";
import { timeAgo } from "@/lib/utils";

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 20);
    else setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data.items ?? []);
        setSuggestions(data.suggestions ?? []);
      } catch {
        /* aborted or offline */
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query, open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-ink/60 px-4 pt-[8vh] backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Search size={18} className="text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Scoop Room…"
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="rounded-full p-1 text-muted transition hover:bg-surface hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query && (
            <div className="px-3 py-2">
              <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
                <TrendingUp size={12} /> Trending searches
              </p>
              <div className="flex flex-wrap gap-2 px-1 pb-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-border px-3 py-1 text-xs text-foreground/80 transition hover:border-signal hover:text-signal"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && loading && (
            <p className="px-4 py-6 text-sm text-muted">Searching…</p>
          )}

          {query && !loading && results.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted">
              No results for “{query}”. Try a different term.
            </p>
          )}

          {results.map((a) => (
            <Link
              key={a.id}
              href={`/article/${a.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-surface"
            >
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                <BrandImage src={a.coverImage} alt="" fill className="object-cover" sizes="56px" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{a.title}</p>
                <p className="font-mono text-[11px] text-muted">
                  {a.category.name} · {timeAgo(a.publishedAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
