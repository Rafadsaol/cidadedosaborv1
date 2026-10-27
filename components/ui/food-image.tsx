"use client";
import Image from "next/image";
import { useState } from "react";
export function FoodImage({
  src,
  alt,
  priority = false,
  className = "",
  sizes = "(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 40vw",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      src={failed ? "/images/food-fallback.svg" : src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={`food-image ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
