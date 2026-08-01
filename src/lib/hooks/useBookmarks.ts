"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Bookmarks and reading history are stored client-side for now. Once the
 * aggregator has user accounts, swap the localStorage calls below for
 * authenticated API calls (e.g. POST /api/users/me/bookmarks) — the hook
 * signatures returned to components can stay the same.
 */
function useLocalStorageList(key: string) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore corrupted storage */
    }
  }, [key]);

  const persist = useCallback(
    (next: string[]) => {
      setItems(next);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* storage unavailable (private mode, quota, etc.) */
      }
    },
    [key]
  );

  const add = useCallback(
    (slug: string) => {
      persist(Array.from(new Set([slug, ...items])).slice(0, 100));
    },
    [items, persist]
  );

  const remove = useCallback(
    (slug: string) => {
      persist(items.filter((s) => s !== slug));
    },
    [items, persist]
  );

  const toggle = useCallback(
    (slug: string) => {
      if (items.includes(slug)) remove(slug);
      else add(slug);
    },
    [items, add, remove]
  );

  return { items, add, remove, toggle, has: (slug: string) => items.includes(slug) };
}

export function useBookmarks() {
  return useLocalStorageList("scooproom:bookmarks");
}

export function useReadingHistory() {
  return useLocalStorageList("scooproom:reading-history");
}
