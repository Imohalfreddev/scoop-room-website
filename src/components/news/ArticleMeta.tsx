"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { timeAgo } from "@/lib/utils";
import type { Article } from "@/types";
import { cn } from "@/lib/utils";

const pillClassName =
  "inline-flex items-center rounded-full bg-signal px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-white transition hover:bg-signal-bright";

export function CategoryPill({
  name,
  slug,
  className,
  nested = false,
}: {
  name: string;
  slug: string;
  className?: string;
  /** Set true when this pill is rendered inside another <Link>/<a>, to avoid invalid nested anchors. */
  nested?: boolean;
}) {
  const router = useRouter();

  if (nested) {
    return (
      <span
        role="link"
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/category/${slug}`);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/category/${slug}`);
          }
        }}
        className={cn(pillClassName, "cursor-pointer", className)}
      >
        {name}
      </span>
    );
  }

  return (
    <Link
      href={`/category/${slug}`}
      className={cn(pillClassName, className)}
    >
      {name}
    </Link>
  );
}

export function ArticleMeta({
  article,
  showAuthor = true,
  linkAuthor = true,
  className,
}: {
  article: Article;
  showAuthor?: boolean;
  /** Set false when nested inside another <Link>/<a> (e.g. ArticleCard) to
   * avoid an invalid nested anchor. */
  linkAuthor?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-muted",
        className
      )}
    >
      {showAuthor &&
        (linkAuthor ? (
          <>
            <Link href={`/author/${article.author.slug}`} className="hover:text-signal">
              {article.author.name}
            </Link>
            <span>·</span>
          </>
        ) : (
          <>
            <span>{article.author.name}</span>
            <span>·</span>
          </>
        ))}
      <time dateTime={article.publishedAt} suppressHydrationWarning>
        {timeAgo(article.publishedAt)}
      </time>
      <span>·</span>
      <span>{article.readTimeMinutes} min read</span>
    </div>
  );
}
