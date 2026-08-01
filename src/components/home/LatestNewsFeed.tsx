"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Article, CategorySlug } from "@/types";
import { ArticleCard } from "@/components/news/ArticleCard";
import { Loader2 } from "lucide-react";

export function LatestNewsFeed({
  initialArticles,
  initialHasMore,
  pageSize = 9,
  category,
}: {
  initialArticles: Article[];
  initialHasMore: boolean;
  pageSize?: number;
  category?: CategorySlug;
}) {
  const [items, setItems] = useState(initialArticles);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({
        page: String(nextPage),
        pageSize: String(pageSize),
      });
      if (category) params.set("category", category);
      const res = await fetch(`/api/articles?${params.toString()}`);
      const data = await res.json();
      setItems((prev) => [...prev, ...data.items]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, pageSize, category]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
      <div ref={sentinelRef} className="flex justify-center py-10">
        {loading && <Loader2 className="animate-spin text-signal" size={22} />}
        {!hasMore && !loading && (
          <p className="text-sm text-muted">You&rsquo;re all caught up.</p>
        )}
      </div>
    </div>
  );
}
