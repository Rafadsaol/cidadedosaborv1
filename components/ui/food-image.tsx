"use client";
import Image from "next/image";
import { useState } from "react";
export function FoodImage({
  src,
  alt,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      src={failed ? "/images/food-fallback.svg" : src}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 40vw"
      className={`food-image ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
