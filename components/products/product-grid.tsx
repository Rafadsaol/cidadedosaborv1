"use client";
import { useState } from "react";
import { ProductCard } from "./product-card";
import { ProductModal } from "./product-modal";
import type { Product } from "@/types";
export function ProductGrid({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null);
  return (
    <>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onDetails={setSelected} />
        ))}
      </div>
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
