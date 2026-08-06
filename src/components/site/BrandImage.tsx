"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

/**
 * Branded fallback shown any time an image link is missing, empty, or
 * fails to load (broken R2 URL, deleted asset, bad paste, etc). Swap the
 * file at /public/brand/scoop-room-placeholder.jpg to change it everywhere.
 */
export const BRAND_PLACEHOLDER_SRC = "/brand/scoop-room-placeholder.jpg";

// Keep in sync with images.remotePatterns in next.config.ts — this is the
// same allow-list, checked client-side so we can skip next/image's
// optimizer (and its host allow-list, which would otherwise reject the
// request) for anything not on it, instead of erroring.
const OPTIMIZED_HOSTS = [/\.r2\.dev$/];

function isOptimizedSrc(src: string) {
  if (src.startsWith("/")) return true; // same-origin, always optimizable
  try {
    const { hostname } = new URL(src);
    return OPTIMIZED_HOSTS.some((pattern) => pattern.test(hostname));
  } catch {
    return false;
  }
}

type BrandImageProps = Omit<ImageProps, "src" | "onError"> & {
  src?: string | null;
};

/**
 * Drop-in replacement for next/image's <Image> that falls back to the
 * Scoop Room branded placeholder graphic whenever `src` is missing or the
 * real image fails to load, instead of showing the browser's broken-image
 * icon. Safe to use inside server components since only this file is a
 * client component.
 *
 * Also renders unoptimized automatically for any src whose host isn't on
 * next.config.ts's images.remotePatterns allow-list — e.g. a bot-sourced
 * article's cover image from whichever publisher it came from. Those load
 * straight from the source instead of being proxied through next/image
 * (which would either 400, or require wildcarding remotePatterns, an open
 * image-proxy risk this app deliberately avoids). Pass `unoptimized`
 * explicitly yourself to override this in either direction.
 */
export function BrandImage({ src, alt, ...rest }: BrandImageProps) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = !src || failed ? BRAND_PLACEHOLDER_SRC : src;
  const unoptimized = rest.unoptimized ?? !isOptimizedSrc(resolvedSrc);

  return (
    <Image
      {...rest}
      src={resolvedSrc}
      alt={alt}
      unoptimized={unoptimized}
      onError={() => setFailed(true)}
    />
  );
}
