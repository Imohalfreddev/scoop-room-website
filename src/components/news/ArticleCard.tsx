import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types";
import { ArticleMeta, CategoryPill } from "./ArticleMeta";
import { BookmarkButton } from "./BookmarkButton";
import { cn } from "@/lib/utils";

type Variant = "featured" | "standard" | "compact" | "list";

export function ArticleCard({
  article,
  variant = "standard",
  priority = false,
  index,
  basePath = "/article",
}: {
  article: Article;
  variant?: Variant;
  priority?: boolean;
  index?: number;
  /** News articles live at /article/[slug], blog posts at /blog/[slug]. */
  basePath?: string;
}) {
  if (variant === "list") {
    return (
      <Link
        href={`${basePath}/${article.slug}`}
        className="group flex items-start gap-4 border-b border-border py-4 last:border-0"
      >
        {typeof index === "number" && (
          <span className="font-display text-2xl font-semibold text-border tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="mb-1 line-clamp-2 text-[15px] font-semibold leading-snug transition group-hover:text-signal">
            {article.title}
          </p>
          <ArticleMeta article={article} showAuthor={false} />
        </div>
        <div className="relative hidden size-16 shrink-0 overflow-hidden rounded-lg bg-surface sm:block">
          <Image src={article.coverImage} alt={article.title} fill sizes="64px" className="object-cover" />
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`${basePath}/${article.slug}`} className="group flex gap-3">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface">
          <Image src={article.coverImage} alt={article.title} fill sizes="80px" className="object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <div className="min-w-0">
          <CategoryPill name={article.category.name} slug={article.category.slug} className="mb-1.5" nested />
          <p className="line-clamp-2 text-sm font-semibold leading-snug transition group-hover:text-signal">
            {article.title}
          </p>
          <ArticleMeta article={article} showAuthor={false} className="mt-1" />
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`${basePath}/${article.slug}`}
        className="group relative block h-full overflow-hidden rounded-2xl bg-ink"
      >
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute right-4 top-4">
          <BookmarkButton slug={article.slug} />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <CategoryPill name={article.category.name} slug={article.category.slug} className="mb-3" nested />
          <h3 className="max-w-xl text-2xl font-semibold leading-tight text-white sm:text-3xl">
            {article.title}
          </h3>
          <p className="mt-2 hidden max-w-lg text-sm text-white/75 sm:block">{article.dek}</p>
          <ArticleMeta article={article} linkAuthor={false} className="mt-4 text-white/70" />
        </div>
      </Link>
    );
  }

  return (
    <Link href={`${basePath}/${article.slug}`} className="group block">
      <div className="relative mb-3 aspect-[16/10] overflow-hidden rounded-xl bg-surface">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, 100vw"
          className={cn("object-cover transition duration-500 group-hover:scale-105")}
        />
        <div className="absolute right-3 top-3">
          <BookmarkButton slug={article.slug} />
        </div>
      </div>
      <CategoryPill name={article.category.name} slug={article.category.slug} className="mb-2" nested />
      <h3 className="line-clamp-2 text-[17px] font-semibold leading-snug transition group-hover:text-signal">
        {article.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted">{article.dek}</p>
      <ArticleMeta article={article} linkAuthor={false} className="mt-3" />
    </Link>
  );
}