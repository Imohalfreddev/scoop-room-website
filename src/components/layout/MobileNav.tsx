"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { primaryNav } from "@/lib/constants";
import { ThemeToggle } from "./ThemeToggle";

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-ink/50 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-[95] flex w-[82%] max-w-sm flex-col bg-background shadow-2xl md:hidden"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="font-display text-sm font-semibold tracking-wide">
                Menu
              </span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  className="rounded-full p-2 text-muted hover:bg-surface hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-3">
              {primaryNav.map((item) => (
                <Link
                  key={item.slug}
                  href={`/category/${item.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium text-foreground/85 transition hover:bg-surface hover:text-signal"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-border pt-2">
                <Link
                  href="/blog"
                  onClick={onClose}
                  className="block rounded-lg px-3 py-3 text-[15px] font-medium text-foreground/85 hover:bg-surface hover:text-signal"
                >
                  Blog
                </Link>
                <Link
                  href="/bookmarks"
                  onClick={onClose}
                  className="block rounded-lg px-3 py-3 text-[15px] font-medium text-foreground/85 hover:bg-surface hover:text-signal"
                >
                  Bookmarks
                </Link>
              </div>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
