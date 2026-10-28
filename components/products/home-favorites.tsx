"use client";

import { useDemo } from "@/components/demo-provider";
import { ProductGrid } from "./product-grid";
export function HomeFavorites() {
  const {
    products
  } = useDemo();
  const featured = products.filter(p => p.category === "Hambúrgueres").slice(0, 4);
  return featured.length ? <ProductGrid products={featured} /> : <p className="muted">Estamos preparando novos favoritos. Explore as outras categorias do cardápio.</p>;
}
