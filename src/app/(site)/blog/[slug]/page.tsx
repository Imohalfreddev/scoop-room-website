import type { Metadata } from "next";
import { BrandImage } from "@/components/site/BrandImage";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/api/articles";
import { CategoryPill, ArticleMeta } from "@/components/news/ArticleMeta";
import { ShareBar } from "@/components/news/ShareBar";
import { TagList } from "@/components/news/TagList";
import { AuthorCard } from "@/components/news/AuthorCard";
import { RelatedArticles } from "@/components/news/RelatedArticles";
import { CommentSection } from "@/components/news/CommentSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, newsArticleJsonLd } from "@/lib/seo/jsonld";
import { site } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBlogPostBySlug(slug);
  if (!data) return {};
  const { article: post } = data;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, images: [post.coverImage] },
  };
}

export const revalidate = 60;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getBlogPostBySlug(slug);
  if (!data) notFound();
  const { article: post, related } = data;
  const url = `${site.url}/blog/${post.slug}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd data={newsArticleJsonLd(post)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: site.url },
          { name: "Blog", url: `${site.url}/blog` },
          { name: post.title, url },
        ])}
      />

      <CategoryPill name={post.category.name} slug={post.category.slug} className="mb-4" />
      <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 text-lg text-muted">{post.dek}</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
        <ArticleMeta article={post} />
        <ShareBar title={post.title} url={url} />
      </div>

      <div className="relative my-8 aspect-video overflow-hidden rounded-2xl bg-surface">
        <BrandImage src={post.coverImage} alt={post.title} fill priority sizes="768px" className="object-cover" />
      </div>

      <div
        className="prose max-w-none prose-headings:font-display prose-headings:font-semibold prose-a:text-signal dark:prose-invert sm:prose-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-8">
        <TagList tags={post.tags} />
      </div>

      <div className="mt-10">
        <AuthorCard author={post.author} />
      </div>

      <div className="mt-14">
        <RelatedArticles articles={related} basePath="/blog" />
      </div>

      <div className="mt-14">
        <CommentSection articleId={post.id} />
      </div>
    </article>
  );
}