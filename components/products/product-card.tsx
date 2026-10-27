"use client";
import { Plus, ArrowUpRight } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { useCart } from "@/components/cart-provider";
import { money } from "@/lib/utils";
import type { Product } from "@/types";
export function ProductCard({
  product,
  onDetails,
}: {
  product: Product;
  onDetails: (product: Product) => void;
}) {
  const { add, ready } = useCart();
  return (
    <article className="product-card">
      <button
        className="product-photo"
        onClick={() => onDetails(product)}
        aria-label={`Ver detalhes de ${product.name}`}
      >
        <FoodImage src={product.image} alt={product.name} />
        {product.tag && (
          <span
            className={`product-tag ${product.id === "veggie" ? "green" : ""}`}
          >
            {product.tag}
          </span>
        )}
        <span className="photo-arrow">
          <ArrowUpRight size={18} />
        </span>
      </button>
      <div className="product-body">
        <button className="product-title" onClick={() => onDetails(product)}>
          <h3>{product.name}</h3>
        </button>
        <p>{product.description}</p>
        <div className="product-bottom">
          <strong>{money(product.price)}</strong>
          <button
            className="add-button"
            disabled={!ready}
            onClick={() => add(product.id)}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <Plus size={18} />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </article>
  );
}
