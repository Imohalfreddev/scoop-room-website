import type { Article } from "@/types";
import { ArticleCard } from "./ArticleCard";
import { SectionHeader } from "@/components/home/SectionHeader";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  return (
    <section className="mt-4">
      <SectionHeader eyebrow="Keep reading" title="Related stories" />
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}
