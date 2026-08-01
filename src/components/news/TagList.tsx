import Link from "next/link";
import type { Tag } from "@/types";

export function TagList({ tags }: { tags: Tag[] }) {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <Link
          key={t.id}
          href={`/search?tag=${t.slug}`}
          className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground/75 transition hover:border-signal hover:text-signal"
        >
          #{t.name}
        </Link>
      ))}
    </div>
  );
}
