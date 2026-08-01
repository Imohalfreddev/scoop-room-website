"use client";

import { useState } from "react";
import { Bookmark, History } from "lucide-react";
import { useBookmarks, useReadingHistory } from "@/lib/hooks/useBookmarks";
import { articles } from "@/lib/mock/articles";
import { ArticleCard } from "@/components/news/ArticleCard";

export function BookmarksClient() {
  const [tab, setTab] = useState<"bookmarks" | "history">("bookmarks");
  const bookmarks = useBookmarks();
  const history = useReadingHistory();

  const slugs = tab === "bookmarks" ? bookmarks.items : history.items;
  const savedArticles = slugs
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
      <div className="wire mb-8 pl-3">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-signal">
          Your library
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Saved &amp; recent
        </h1>
      </div>

      <div className="mb-10 flex gap-2 border-b border-border">
        <button
          onClick={() => setTab("bookmarks")}
          className={`flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition ${
            tab === "bookmarks"
              ? "border-signal text-signal"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <Bookmark size={15} /> Bookmarks ({bookmarks.items.length})
        </button>
        <button
          onClick={() => setTab("history")}
          className={`ml-4 flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition ${
            tab === "history"
              ? "border-signal text-signal"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <History size={15} /> Reading history ({history.items.length})
        </button>
      </div>

      {savedArticles.length === 0 ? (
        <p className="text-muted">
          {tab === "bookmarks"
            ? "You haven't saved any stories yet. Tap the bookmark icon on any article to save it here."
            : "Articles you read will show up here."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {savedArticles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
