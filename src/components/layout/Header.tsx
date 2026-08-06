"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { primaryNav } from "@/lib/constants";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo priority />

          <nav className="no-scrollbar hidden items-center gap-1 overflow-x-auto lg:flex">
            {primaryNav.map((item) => (
              <Link
                key={item.slug}
                href={`/category/${item.slug}`}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium tracking-wide text-foreground/70 transition hover:bg-surface hover:text-signal"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="flex size-9 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-signal hover:text-signal"
            >
              <Search size={16} />
            </button>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <Link
              href="#newsletter"
              className="hidden rounded-full bg-signal px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-signal-bright sm:block"
            >
              Subscribe
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex size-9 items-center justify-center rounded-full border border-border text-foreground/70 lg:hidden"
            >
              <Menu size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside <header> on purpose: <header> has backdrop-blur-md
          (a backdrop-filter), which creates a new CSS containing block for
          any `position: fixed` descendant. That was trapping this drawer's
          fixed inset-0/inset-y-0 panels inside the header's own small box
          instead of the viewport — squishing the menu down to just its
          header row and letting the page show through underneath. */}
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
