"use client";

import { useEffect, useRef, useState } from "react";
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

// How far an image's own aspect ratio is allowed to differ from its
// container's (as a fraction of the container's ratio) before adaptive
// mode backs off from cropping. Below this, the crop is minor enough to
// be imperceptible, so cover wins and fills the box with no empty space.
// Above it, cropping would start cutting into the actual subject, so
// contain wins and the full image shows — backed by a blurred fill
// instead of empty space (see the backdrop layer below).
const COVER_TOLERANCE = 0.2;

type FitMode = "adaptive" | "cover" | "contain" | "fill";

type BrandImageProps = Omit<ImageProps, "src" | "onError"> & {
  src?: string | null;
  /**
   * - "adaptive" (default): once the image has loaded, compares its own
   *   aspect ratio to its container's. Close enough (within
   *   COVER_TOLERANCE) → cover, fills the box completely. Not close →
   *   contain, shows the whole image (no cropping) backed by a blurred,
   *   scaled-up copy of the same image filling the rest of the box, so
   *   there's never dead empty space either. Requires `fill` — has no
   *   effect otherwise.
   * - "cover" / "contain": skip the measuring, always use that value.
   *   Use "cover" for avatars/profile photos, where cropping to a
   *   face/head is the expected treatment, not lost content.
   *
   * Applies to the placeholder fallback too now — it used to be forced
   * to "cover" unconditionally, which crops the wordmark's edges off in
   * narrow/tall containers (e.g. "SCOOP ROOM" → "SCOOP ROO"). Letting it
   * go through the same adaptive logic as real photos fixes that.
   */
  fitMode?: FitMode;
};

/**
 * Drop-in replacement for next/image's <Image> that:
 *
 * 1. Falls back to the Scoop Room branded placeholder graphic whenever
 *    `src` is missing or the real image fails to load, instead of showing
 *    the browser's broken-image icon.
 * 2. Renders unoptimized automatically for any src whose host isn't on
 *    next.config.ts's images.remotePatterns allow-list — e.g. a
 *    bot-sourced article's cover image from whichever publisher it came
 *    from. Those load straight from the source instead of being proxied
 *    through next/image (which would either 400, or require wildcarding
 *    remotePatterns, an open image-proxy risk this app deliberately
 *    avoids). Pass `unoptimized` explicitly yourself to override this in
 *    either direction.
 * 3. Picks cover vs. contain per image (see `fitMode` above) instead of
 *    one fixed choice for every image regardless of its own shape, and
 *    never leaves a bare empty gap when contain is chosen — a blurred
 *    backdrop of the same image fills the difference instead.
 *
 * Safe to use inside server components since only this file is a client
 * component.
 *
 * Note on scope: this only controls how an image is *fit into its box*.
 * If a source image already has its own baked-in padding/letterboxing
 * (some publishers embed white bars directly into the photo file), that's
 * part of the image's actual pixels — no amount of object-fit/backdrop
 * handling here can remove it, since it never was empty space in the
 * first place from this component's point of view.
 */
export function BrandImage({
  src,
  alt,
  style,
  className,
  onLoad,
  fitMode = "fill",
  ...rest
}: BrandImageProps) {
  const [failed, setFailed] = useState(false);
  const [measuredFit, setMeasuredFit] = useState<"cover" | "contain">("cover");
  const [decoded, setDecoded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const showingPlaceholder = !src || failed;
  const resolvedSrc = showingPlaceholder ? BRAND_PLACEHOLDER_SRC : src;
  const unoptimized = rest.unoptimized ?? !isOptimizedSrc(resolvedSrc);
  const adaptive = fitMode === "adaptive" && Boolean(rest.fill);
  const objectFit = fitMode === "adaptive" ? measuredFit : fitMode;
  const showBackdrop = adaptive && objectFit === "contain";

  // `onLoad` alone isn't reliable either: if the browser already has this
  // image cached (very likely while iterating on the same page during
  // dev, or on a repeat visit), it can finish loading before React has
  // attached the `onLoad` listener, so the event never fires and
  // `decoded` gets stuck at false forever. Checking `img.complete`
  // directly covers that case — it's a live DOM property, so it reads
  // true immediately for a cached image with no event needed.
  useEffect(() => {
    setDecoded(imgRef.current?.complete ?? false);
  }, [resolvedSrc]);

  // Measuring on `onLoad` is unreliable: it fires once the <img> has
  // decoded, which says nothing about whether the *container's* layout
  // (aspect-ratio box, grid track, flex basis, etc.) has actually been
  // committed by the browser yet — especially for `priority` images,
  // which can decode fast enough to race style/layout commit. A
  // ResizeObserver instead fires only once the container has a real,
  // settled size, and fires again on any later resize (breakpoint
  // change, orientation change), so a mistimed first read can't get
  // stuck forever the way the old synchronous onLoad read could.
  useEffect(() => {
    if (!adaptive || !decoded) return;
    const img = imgRef.current;
    const container = img?.parentElement;
    if (!img || !container || !img.naturalWidth || !img.naturalHeight) return;

    const imageRatio = img.naturalWidth / img.naturalHeight;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width: containerWidth, height: containerHeight } = entry.contentRect;
      if (!containerWidth || !containerHeight) return;

      const containerRatio = containerWidth / containerHeight;
      const relativeDiff = Math.abs(imageRatio - containerRatio) / containerRatio;
      setMeasuredFit(relativeDiff <= COVER_TOLERANCE ? "cover" : "contain");
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [adaptive, decoded]);

  const sharpImage = (
    <Image
      {...rest}
      ref={imgRef}
      src={resolvedSrc}
      alt={alt}
      className={className}
      unoptimized={unoptimized}
      onError={() => setFailed(true)}
      onLoad={(event) => {
        onLoad?.(event);
        setDecoded(true);
      }}
      // Inline style so this reliably wins regardless of whatever
      // object-fit class (if any) is left on the caller's className —
      // Tailwind utility classes have no guaranteed override order
      // against each other, but an inline style always beats a class.
      style={{ ...style, objectFit }}
    />
  );

  if (!showBackdrop) return sharpImage;

  // Contain mode: the sharp image is shown in full with no cropping, and
  // a blurred, darkened, scaled-up copy of the SAME image fills the box
  // behind it — so the letterbox gap reads as an intentional soft
  // backdrop instead of dead space. `scale(1.15)` on the blur layer hides
  // the blur's own soft edge from ever peeking past the box's border.
  // The wrapper needs its own stacking/clip context since it's now
  // hosting two absolutely-positioned `fill` images instead of one.
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Image
        src={resolvedSrc}
        alt=""
        aria-hidden="true"
        fill
        unoptimized={unoptimized}
        sizes={rest.sizes}
        priority={rest.priority}
        style={{
          objectFit: "cover",
          filter: "blur(28px) brightness(0.55) saturate(1.15)",
          transform: "scale(1.15)",
        }}
      />
      {sharpImage}
    </div>
  );
}
