import type { Metadata } from "next";
import { BrandImage } from "@/components/site/BrandImage";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/api/articles";
import { articles } from "@/lib/mock/articles";
import { CategoryPill } from "@/components/news/ArticleMeta";
import { ArticleMeta } from "@/components/news/ArticleMeta";
import { ShareBar } from "@/components/news/ShareBar";
import { BookmarkButton } from "@/components/news/BookmarkButton";
import { TagList } from "@/components/news/TagList";
import { AuthorCard } from "@/components/news/AuthorCard";
import { RelatedArticles } from "@/components/news/RelatedArticles";
import { Gallery } from "@/components/news/Gallery";
import { VideoPlayer } from "@/components/news/VideoPlayer";
import { CommentSection } from "@/components/news/CommentSection";
import { AdSlot } from "@/components/news/AdSlot";
import { getAdSlotConfigs } from "@/lib/api/adSlots";
import { RecordReadingHistory } from "@/components/news/RecordReadingHistory";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, newsArticleJsonLd } from "@/lib/seo/jsonld";
import { site } from "@/lib/constants";

export function generateStaticParams() {
  return articles.slice(0, 20).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getArticleBySlug(slug);
  if (!data) return {};
  const { article } = data;

  return {
    title: article.seo?.metaTitle ?? article.title,
    description: article.seo?.metaDescription ?? article.excerpt,
    alternates: { canonical: article.seo?.canonicalUrl ?? `/article/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      images: [article.seo?.ogImage ?? article.coverImage],
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.seo?.ogImage ?? article.coverImage],
    },
    robots: article.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export const revalidate = 60;

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getArticleBySlug(slug);
  if (!data) notFound();
  const { article, related } = data;
  const inArticleAds = await getAdSlotConfigs("in-article");
  const url = `${site.url}/article/${article.slug}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <RecordReadingHistory slug={article.slug} />
      <JsonLd data={newsArticleJsonLd(article)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.url },
          { name: article.category.name, url: `${site.url}/category/${article.category.slug}` },
          { name: article.title, url },
        ])}
      />

      <CategoryPill name={article.category.name} slug={article.category.slug} className="mb-4" />
      <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
        {article.title}
      </h1>
      <p className="mt-4 text-lg text-muted">{article.dek}</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
        <ArticleMeta article={article} />
        <div className="flex items-center gap-3">
          <ShareBar title={article.title} url={url} />
          <BookmarkButton
            slug={article.slug}
            className="!static !size-9 border border-border !bg-transparent !text-foreground/70 hover:!text-signal"
          />
        </div>
      </div>

      <div className="relative my-8 aspect-video overflow-hidden rounded-2xl bg-surface">
        <BrandImage
          src={article.coverImage}
          alt={article.title}
          fill
          priority
          sizes="(min-width: 768px) 768px, 100vw"
        />
      </div>

      <div
        className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-semibold prose-a:text-signal prose-img:rounded-2xl dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {article.videoUrl && <VideoPlayer src={article.videoUrl} poster={article.coverImage} />}
      {article.gallery && <Gallery images={article.gallery} />}

      <AdSlot placement="in-article" configs={inArticleAds} className="my-10" />

      <div className="mt-8">
        <TagList tags={article.tags} />
      </div>

      <div className="mt-10">
        <AuthorCard author={article.author} />
      </div>

      <div className="mt-14">
        <RelatedArticles articles={related} />
      </div>

      <div className="mt-14">
        <CommentSection articleId={article.id} />
      </div>
    </article>
  );
}