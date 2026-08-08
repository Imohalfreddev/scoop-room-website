"use client";

import { useState } from "react";
import { BrandImage } from "@/components/site/BrandImage";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MediaAsset } from "@/types";

export function Gallery({ images }: { images: MediaAsset[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!images.length) return null;

  return (
    <div className="my-8">
      <div className="grid grid-cols-3 gap-2">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-surface"
          >
            <BrandImage
              src={img.url}
              alt={img.alt}
              fill
              sizes="200px"
              className="transition duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setOpenIndex(null)}
          >
            <button
              onClick={() => setOpenIndex(null)}
              aria-label="Close gallery"
              className="absolute right-5 top-5 text-white/80 hover:text-white"
            >
              <X size={22} />
            </button>
            {openIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex((i) => (i !== null ? i - 1 : i));
                }}
                aria-label="Previous image"
                className="absolute left-4 text-white/70 hover:text-white"
              >
                <ChevronLeft size={28} />
              </button>
            )}
            <div
              className="relative h-[70vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <BrandImage
                src={images[openIndex].url}
                alt={images[openIndex].alt}
                fill
                sizes="90vw"
              />
            </div>
            {openIndex < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex((i) => (i !== null ? i + 1 : i));
                }}
                aria-label="Next image"
                className="absolute right-4 text-white/70 hover:text-white"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
