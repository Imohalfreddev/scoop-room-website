import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  eyebrow,
  title,
  href,
  rightSlot,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  /** Optional custom content for the right side of the row (e.g. carousel
   * controls), rendered alongside — or instead of — the "View all" link. */
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div className="wire flex items-baseline gap-3 pl-3">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-signal">
            {eyebrow}
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-foreground/70 transition hover:text-signal"
          >
            View all <ArrowRight size={14} />
          </Link>
        )}
        {rightSlot}
      </div>
    </div>
  );
}
