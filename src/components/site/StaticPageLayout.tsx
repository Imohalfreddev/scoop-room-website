interface StaticPageLayoutProps {
  title: string;
  subtitle?: string;
  updated?: string;
  children: React.ReactNode;
}

export function StaticPageLayout({ title, subtitle, updated, children }: StaticPageLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 border-b border-border pb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 text-[15px] text-foreground/70">{subtitle}</p>}
        {updated && (
          <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-muted">
            Last updated: {updated}
          </p>
        )}
      </header>
      <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-semibold prose-a:text-signal dark:prose-invert">
        {children}
      </div>
    </div>
  );
}
