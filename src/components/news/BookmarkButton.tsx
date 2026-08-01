"use client";

import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { cn } from "@/lib/utils";

export function BookmarkButton({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const { has, toggle } = useBookmarks();
  const active = has(slug);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={active}
      aria-label={active ? "Remove bookmark" : "Save article"}
      className={cn(
        "flex size-8 items-center justify-center rounded-full backdrop-blur transition",
        active
          ? "bg-signal text-white"
          : "bg-black/40 text-white hover:bg-black/60",
        className
      )}
    >
      <Bookmark size={14} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
