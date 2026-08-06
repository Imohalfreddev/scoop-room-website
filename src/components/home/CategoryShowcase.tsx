import type { Article, Category } from "@/types";
import { SectionHeader } from "./SectionHeader";
import { ArticleCard } from "@/components/news/ArticleCard";

export function CategoryShowcase({
  category,
  articles,
}: {
  category: Category;
  articles: Article[];
}) {
  if (!articles.length) return null;
  const [lead, ...rest] = articles;

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
      <SectionHeader
        eyebrow={category.description}
        title={category.name}
        href={`/category/${category.slug}`}
      />
      <div className="grid min-h-[420px] gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <ArticleCard article={lead} variant="featured" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {rest.slice(0, 3).map((a) => (
            <div key={a.id} className="border-b border-border pb-5 last:border-0 lg:pb-0">
              <ArticleCard article={a} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
