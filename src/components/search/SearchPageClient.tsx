"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import type { Article } from "@/types";
import { searchArticles } from "@/lib/api/search";
import { categories } from "@/lib/mock/categories";
import { trendingSearches } from "@/lib/mock/widgets";
import { ArticleCard } from "@/components/news/ArticleCard";

export function SearchPageClient({
  initialQuery,
  initialCategory,
}: {
  initialQuery: string;
  initialCategory: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!q && !category) return;
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSearch() {
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await searchArticles({ q, category: category || undefined, from, to });
      setResults(data.items);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <div className="wire mb-8 pl-3">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-signal">
          Search
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Find a story
        </h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch();
        }}
        className="mb-4 flex items-center gap-2 rounded-2xl border border-border p-2 pl-4"
      >
        <SearchIcon size={18} className="text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search headlines, topics, tags…"
          className="flex-1 bg-transparent py-2 text-base outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-signal-bright"
        >
          Search
        </button>
      </form>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus-visible:border-signal"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          aria-label="From date"
          className="rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus-visible:border-signal"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          aria-label="To date"
          className="rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus-visible:border-signal"
        />
        <button
          onClick={runSearch}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:border-signal hover:text-signal"
        >
          Apply filters
        </button>
      </div>

      {!hasSearched && (
        <div className="mb-8">
          <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
            Trending searches
          </p>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setQ(s);
                  setTimeout(runSearch, 0);
                }}
                className="rounded-full border border-border px-3 py-1.5 text-sm transition hover:border-signal hover:text-signal"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && <p className="text-sm text-muted">Searching…</p>}

      {hasSearched && !loading && (
        <p className="mb-6 text-sm text-muted">
          {total} result{total === 1 ? "" : "s"}
          {q && (
            <>
              {" "}
              for &ldquo;<span className="text-foreground">{q}</span>&rdquo;
            </>
          )}
        </p>
      )}

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>

      {hasSearched && !loading && results.length === 0 && (
        <p className="text-muted">
          No stories matched. Try{" "}
          <Link href="/" className="text-signal hover:underline">
            browsing the homepage
          </Link>{" "}
          instead.
        </p>
      )}
    </div>
  );
}
