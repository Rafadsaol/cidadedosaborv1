"use client";
import { Plus, ArrowUpRight } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { money } from "@/lib/utils";
import type { Product } from "@/types";
export function ProductCard({
  product,
  onDetails,
}: {
  product: Product;
  onDetails: (product: Product) => void;
}) {
  return (
    <article className="product-card">
      <button
        className="product-photo"
        onClick={() => onDetails(product)}
        aria-label={`Ver detalhes de ${product.name}`}
      >
        <span className="product-photo-frame">
          <FoodImage
            src={product.image}
            alt={product.name}
            sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 25vw"
          />
        </span>
        {(product.tag || product.bestseller || product.originalPriceCents) && (
          <span
            className={`product-tag ${product.id === "veggie" ? "green" : ""}`}
          >
            {product.originalPriceCents
              ? "PROMOÇÃO"
              : product.bestseller
                ? "MAIS VENDIDO"
                : product.tag}
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
          <span className="card-price">
            {product.originalPriceCents && (
              <del>{money(product.originalPriceCents)}</del>
            )}
            <strong>{money(product.priceCents)}</strong>
          </span>
          <button
            className="add-button"
            disabled={product.available === false}
            onClick={() => onDetails(product)}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <Plus size={18} />
            <span>{product.available === false ? "Indisponível" : "Adicionar"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
