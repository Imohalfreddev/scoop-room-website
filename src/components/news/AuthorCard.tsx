import { BrandImage } from "@/components/site/BrandImage";
import Link from "next/link";
import { XIcon } from "@/components/icons/SocialIcons";
import type { Author } from "@/types";

export function AuthorCard({ author }: { author: Author }) {
  return (
    <Link
      href={`/author/${author.slug}`}
      className="flex items-start gap-4 rounded-2xl border border-border p-5 transition hover:border-signal/40"
    >
      <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-surface">
        <BrandImage src={author.avatarUrl} alt={author.name} fill sizes="56px" fitMode="cover" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold">{author.name}</p>
        <p className="text-sm text-muted">{author.title}</p>
        <p className="mt-2 line-clamp-2 text-sm text-foreground/75">{author.bio}</p>
        {author.twitter && (
          <span className="mt-2 inline-flex items-center gap-1 text-xs text-muted">
            <XIcon size={12} /> {author.twitter}
          </span>
        )}
      </div>
    </Link>
  );
}
