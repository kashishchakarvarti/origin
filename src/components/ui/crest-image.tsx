"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FALLBACK_IMAGE, getCategoryImage, resolveImageUrl } from "@/lib/images";

type CrestImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallback?: string;
  category?: string;
  seed?: string | number;
};

export function CrestImage({
  src,
  fallback = FALLBACK_IMAGE,
  category,
  seed,
  alt,
  ...props
}: CrestImageProps) {
  const resolved = useMemo(
    () => resolveImageUrl(src, category, seed ?? alt),
    [src, category, seed, alt]
  );
  const [currentSrc, setCurrentSrc] = useState(resolved);

  useEffect(() => {
    setCurrentSrc(resolved);
  }, [resolved]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => {
        const next =
          category && seed !== undefined ? getCategoryImage(category, seed) : fallback;
        if (currentSrc !== next) setCurrentSrc(next);
        else if (currentSrc !== fallback) setCurrentSrc(fallback);
      }}
    />
  );
}
