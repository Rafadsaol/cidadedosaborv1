"use client";
import Link from "next/link";
import { useState } from "react";
import { Plus, Trash2, ShoppingBag, ArrowRight, Info } from "lucide-react";
import { useCart } from "./cart-provider";
import { products } from "@/data/products";
import { FoodImage } from "./ui/food-image";
import { QuantityControl } from "./ui/quantity-control";
import { ConfirmDialog } from "./ui/confirm-dialog";
import { ItemDetails } from "./products/item-details";
import { unitPriceCents } from "@/lib/cart";
import { money } from "@/lib/utils";
export function CartPage() {
  const { items, ready, subtotalCents, count, update, remove, clear } =
    useCart();
  const [confirm, setConfirm] = useState(false);
  if (!ready)
    return (
      <div className="container empty-state" role="status">
        Carregando seu carrinho…
      </div>
    );
  if (!items.length)
    return (
      <div className="container empty-state">
        <div className="empty-icon">
          <ShoppingBag size={44} />
        </div>
        <h2>A fome chegou antes do pedido?</h2>
        <p>Seu carrinho ainda está vazio. Temos um sabor esperando por você.</p>
        <Link href="/cardapio" className="button">
          Explorar cardápio <ArrowRight size={18} />
        </Link>
      </div>
    );
  return (
    <section className="container cart-layout">
      <div className="cart-items">
        <div className="cart-list-heading">
          <span>
            {items.length} {items.length === 1 ? "combinação" : "combinações"} ·{" "}
            {count} itens
          </span>
          <button className="remove-button" onClick={() => setConfirm(true)}>
            <Trash2 size={15} /> Esvaziar carrinho
          </button>
        </div>
        {items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          const unit = unitPriceCents(product, item.configuration);
          return (
            <article className="cart-item" key={item.key}>
              <div className="cart-photo">
                <FoodImage
                  src={product.image}
                  alt={product.name}
                  sizes="110px"
                />
              </div>
              <div className="cart-item-info">
                <h2>{product.name}</h2>
                <span className="muted small">
                  {money(unit)} cada · base {money(product.priceCents)}
                </span>
                <ItemDetails product={product} item={item} />
                <QuantityControl
                  name={product.name}
                  value={item.quantity}
                  allowRemove
                  onChange={(quantity) => update(item.key, quantity)}
                />
              </div>
              <div className="cart-item-price">
                <strong>{money(unit * item.quantity)}</strong>
                <button
                  className="remove-button"
                  onClick={() => remove(item.key)}
                  aria-label={`Remover ${product.name}`}
                >
                  <Trash2 size={16} /> Remover
                </button>
              </div>
            </article>
          );
        })}
        <Link href="/cardapio" className="text-link">
          ← Continuar explorando o cardápio
        </Link>
      </div>
      <aside className="summary">
        <span className="eyebrow">BOAS ESCOLHAS POR AQUI</span>
        <h2>Resumo do carrinho</h2>
        <div className="summary-row">
          <span>Itens ({count})</span>
          <span>{money(subtotalCents)}</span>
        </div>
        <div className="summary-row">
          <span>Entrega</span>
          <span>Simulada no checkout</span>
        </div>
        <div className="summary-total">
          <span>Subtotal</span>
          <strong>{money(subtotalCents)}</strong>
        </div>
        <div className="info-box">
          <Info size={20} />
          <p>
            Este carrinho é uma demonstração. Personalize sua experiência e
            experimente o checkout, sem envio de pedidos nem cobrança.
          </p>
        </div>
        <Link href="/checkout" className="button full-width">
          Ir para checkout demonstrativo <ArrowRight size={17} />
        </Link>
        <Link href="/cardapio" className="text-link cart-more">
          <Plus size={16} /> Adicionar mais sabores
        </Link>
        <p className="small muted">
          Seu carrinho fica salvo somente neste navegador.
        </p>
      </aside>
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={clear}
      />
    </section>
  );
}
