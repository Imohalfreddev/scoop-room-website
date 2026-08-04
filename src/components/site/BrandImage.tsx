"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

/**
 * Branded fallback shown any time an image link is missing, empty, or
 * fails to load (broken R2 URL, deleted asset, bad paste, etc). Swap the
 * file at /public/brand/scoop-room-placeholder.jpg to change it everywhere.
 */
export const BRAND_PLACEHOLDER_SRC = "/brand/scoop-room-placeholder.jpg";

type BrandImageProps = Omit<ImageProps, "src" | "onError"> & {
  src?: string | null;
};

/**
 * Drop-in replacement for next/image's <Image> that falls back to the
 * Scoop Room branded placeholder graphic whenever `src` is missing or the
 * real image fails to load, instead of showing the browser's broken-image
 * icon. Safe to use inside server components since only this file is a
 * client component.
 */
export function BrandImage({ src, alt, ...rest }: BrandImageProps) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = !src || failed ? BRAND_PLACEHOLDER_SRC : src;

  return (
    <Image
      {...rest}
      src={resolvedSrc}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}
