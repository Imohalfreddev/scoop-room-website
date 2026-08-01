import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreakingTicker } from "@/components/layout/BreakingTicker";
import { getTrendingArticles } from "@/lib/api/articles";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breaking = await getTrendingArticles(6);

  return (
    <div className="flex min-h-screen flex-col">
      <BreakingTicker articles={breaking} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
