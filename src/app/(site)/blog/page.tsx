import type { Metadata } from "next";
import { blogPosts, popularBlogPosts } from "@/lib/mock/blog";
import { ArticleCard } from "@/components/news/ArticleCard";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog",
  description: "Opinion, analysis, and long-form stories from the Scoop Room newsroom.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const [lead, ...rest] = blogPosts;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
      <div className="wire mb-10 pl-3">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-signal">
          {site.name} Blog
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Analysis &amp; opinion
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          Longer reads that connect the dots across our daily news coverage.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          {lead && <ArticleCard article={lead} variant="featured" priority />}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
            {rest.map((post) => (
              <ArticleCard key={post.id} article={post} />
            ))}
          </div>
        </div>

        <aside>
          <div className="rounded-2xl border border-border p-5">
            <p className="wire mb-3 pl-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
              Popular posts
            </p>
            <ol className="space-y-3">
              {popularBlogPosts.slice(0, 5).map((post, i) => (
                <li key={post.id}>
                  <Link href={`/blog/${post.slug}`} className="group flex items-start gap-3">
                    <span className="font-display text-xl font-bold text-border">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-medium leading-snug transition group-hover:text-signal">
                        {post.title}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-muted">
                        {formatNumber(post.views)} views
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
