import type { Metadata } from "next";
import { BrandImage } from "@/components/site/BrandImage";
import { notFound } from "next/navigation";
import { authorBySlug, authors } from "@/lib/mock/authors";
import { articles } from "@/lib/mock/articles";
import { ArticleCard } from "@/components/news/ArticleCard";
import { XIcon } from "@/components/icons/SocialIcons";

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = authorBySlug(slug);
  if (!author) return {};
  return { title: author.name, description: author.bio };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = authorBySlug(slug);
  if (!author) notFound();

  const authorArticles = articles.filter((a) => a.author.id === author.id);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
      <div className="mb-12 flex flex-col items-start gap-5 border-b border-border pb-10 sm:flex-row sm:items-center">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-full bg-surface">
          <BrandImage src={author.avatarUrl} alt={author.name} fill sizes="96px" fitMode="cover" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">{author.name}</h1>
          <p className="mt-1 text-signal">{author.title}</p>
          <p className="mt-3 max-w-2xl text-foreground/75">{author.bio}</p>
          {author.twitter && (
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted">
              <XIcon size={14} /> {author.twitter}
            </span>
          )}
        </div>
      </div>

      <h2 className="mb-6 font-display text-xl font-semibold">
        Stories by {author.name} ({authorArticles.length})
      </h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {authorArticles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}
