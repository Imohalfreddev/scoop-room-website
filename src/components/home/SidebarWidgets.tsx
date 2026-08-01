import Link from "next/link";
import { CloudSun, TrendingUp, Flame } from "lucide-react";
import { getWeather, getMarkets } from "@/lib/api/widgets";
import { getTrendingArticles } from "@/lib/api/articles";
import { trendingSearches } from "@/lib/mock/widgets";
import { formatNumber } from "@/lib/utils";
import { AdSlot } from "@/components/news/AdSlot";
import { getAdSlotConfig } from "@/lib/api/adSlots";

export async function SidebarWidgets() {
  const [weather, markets, popular, sidebarAd] = await Promise.all([
    getWeather(),
    getMarkets(),
    getTrendingArticles(5),
    getAdSlotConfig("sidebar"),
  ]);

  return (
    <aside className="sticky top-24 h-fit max-h-[calc(100vh-7rem)] space-y-8 overflow-y-auto pb-2">
      <div className="rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between">
          <p className="wire pl-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
            Weather
          </p>
          <CloudSun size={16} className="text-signal" />
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-3xl font-semibold">{weather.tempC}°C</p>
            <p className="text-sm text-muted">{weather.condition}</p>
          </div>
          <p className="text-sm font-medium text-muted">{weather.location}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between">
          <p className="wire pl-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
            Markets
          </p>
          <TrendingUp size={16} className="text-signal" />
        </div>
        <ul className="mt-3 space-y-2.5">
          {markets.map((m) => (
            <li key={m.symbol} className="flex items-center justify-between text-sm">
              <span className="font-medium">{m.symbol}</span>
              <span className="font-mono text-muted">{m.price.toLocaleString()}</span>
              <span
                className={
                  m.changePercent >= 0 ? "font-mono text-emerald-600" : "font-mono text-signal"
                }
              >
                {m.changePercent >= 0 ? "+" : ""}
                {m.changePercent.toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      </div>

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

      <AdSlot placement="sidebar" config={sidebarAd} />
    </aside>
  );
}
