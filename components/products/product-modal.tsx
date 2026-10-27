"use client";
import { useEffect, useRef } from "react";
import { X, Leaf } from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { ProductCustomizer } from "./product-customizer";
import type { Product } from "@/types";
export function ProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialog.current;
    if (product && el) {
      el.showModal();
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        el.close();
        document.body.style.overflow = prev;
      };
    }
  }, [product]);
  return (
    <dialog
      ref={dialog}
      className="product-modal"
      onCancel={onClose}
      aria-labelledby="product-modal-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {product && (
        <div className="modal-content">
          <button
            className="modal-close icon-button"
            autoFocus
            onClick={onClose}
            aria-label="Fechar detalhes"
          >
            <X />
          </button>
          <div className="modal-photo">
            <FoodImage
              src={product.image}
              alt={product.name}
              sizes="(max-width: 640px) 90vw, 700px"
            />
          </div>
          <div className="modal-body">
            <span className="eyebrow">{product.category}</span>
            <h2 id="product-modal-title">{product.name}</h2>
            <p>{product.description}</p>
            <h3>
              <Leaf size={16} /> O que vai nessa delícia
            </h3>
            <div className="ingredients">
              {product.ingredients.map((i) => (
                <span key={i}>{i}</span>
              ))}
            </div>
            <p className="small muted">
              Contém ou pode conter glúten, leite, ovos e outros alergênicos.
              Ingredientes demonstrativos.
            </p>
            <ProductCustomizer
              key={product.id}
              product={product}
              onClose={onClose}
            />
          </div>
        </div>
      )}
    </dialog>
  );
}
