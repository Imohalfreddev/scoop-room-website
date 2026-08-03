import Link from "next/link";
import { Flame } from "lucide-react";
import { getTrendingArticles } from "@/lib/api/articles";
import { trendingSearches } from "@/lib/mock/widgets";
import { formatNumber } from "@/lib/utils";
import { AdSlot } from "@/components/news/AdSlot";
import { getAdSlotConfigs } from "@/lib/api/adSlots";

export async function SidebarWidgets() {
  const [popular, sidebarAds] = await Promise.all([
    getTrendingArticles(5),
    getAdSlotConfigs("sidebar"),
  ]);

  return (
    <aside className="sticky top-24 h-fit max-h-[calc(100vh-7rem)] space-y-8 overflow-y-auto pb-2">
      <div className="rounded-2xl border border-border p-5">
        <p className="wire mb-3 pl-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
          Popular stories
        </p>
        <ol className="space-y-3">
          {popular.map((a, i) => (
            <li key={a.id}>
              <Link href={`/article/${a.slug}`} className="group flex items-start gap-3">
                <span className="font-display text-xl font-bold text-border">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-medium leading-snug transition group-hover:text-signal">
                    {a.title}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted">
                    {formatNumber(a.views)} views
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl border border-border p-5">
        <div className="mb-3 flex items-center gap-1.5">
          <Flame size={14} className="text-signal" />
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
            Trending searches
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingSearches.map((s) => (
            <Link
              key={s}
              href={`/search?q=${encodeURIComponent(s)}`}
              className="rounded-full border border-border px-3 py-1 text-xs text-foreground/80 transition hover:border-signal hover:text-signal"
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      <AdSlot placement="sidebar" configs={sidebarAds} />
    </aside>
  );
}