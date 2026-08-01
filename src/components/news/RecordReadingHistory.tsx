"use client";

import { useEffect } from "react";
import { useReadingHistory } from "@/lib/hooks/useBookmarks";

export function RecordReadingHistory({ slug }: { slug: string }) {
  const { add } = useReadingHistory();

  useEffect(() => {
    add(slug);
    // Fire-and-forget — never awaited, never blocks rendering, and a
    // failure here should never be visible to the reader.
    fetch(`/api/articles/${slug}/view`, { method: "POST" }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return null;
}
