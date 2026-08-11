"use client";

import { useState } from "react";
import { Link2, Check, Send } from "lucide-react";
import { XIcon, FacebookIcon, LinkedinIcon } from "@/components/icons/SocialIcons";

export function ShareBar({
  title,
  url,
  updatedAt,
}: {
  title: string;
  url: string;
  /**
   * ISO timestamp of the article's last edit. X/Twitter caches a link's
   * card (title/description/image) for up to ~7 days keyed on the exact
   * URL shared, so if a cover image is swapped in the dashboard after a
   * link has already been shared, X keeps serving the old cached image
   * even though the page's og:image tag is already correct. Appending
   * `?v=<updatedAt>` to the X intent link only (not the canonical URL, not
   * the other share targets) gives X a "new" URL to crawl fresh whenever
   * the article changes, without touching SEO-facing canonical links or
   * breaking previously shared/bookmarked URLs.
   */
  updatedAt?: string;
}) {
  const [copied, setCopied] = useState(false);

  const xShareUrl = updatedAt
    ? `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(Date.parse(updatedAt) || updatedAt)}`
    : url;

  const shareLinks = [
    {
      label: "X",
      icon: XIcon,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(xShareUrl)}`,
    },
    {
      label: "Facebook",
      icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: "LinkedIn",
      icon: LinkedinIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      label: "WhatsApp",
      icon: Send,
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex items-center gap-2">
      {shareLinks.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className="flex size-9 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-signal hover:text-signal"
        >
          <Icon size={15} />
        </a>
      ))}
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="flex size-9 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-signal hover:text-signal"
      >
        {copied ? <Check size={15} /> : <Link2 size={15} />}
      </button>
    </div>
  );
}
