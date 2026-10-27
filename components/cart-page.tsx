"use client";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Info,
} from "lucide-react";
import { useCart } from "./cart-provider";
import { products } from "@/data/products";
import { FoodImage } from "./ui/food-image";
import { money } from "@/lib/utils";
export function CartPage() {
  const { items, ready, subtotal, count, update, remove } = useCart();
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
        {items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return (
            <article className="cart-item" key={item.productId}>
              <div className="cart-photo">
                <FoodImage src={product.image} alt={product.name} />
              </div>
              <div className="cart-item-info">
                <h2>{product.name}</h2>
                <span className="muted small">{money(product.price)} cada</span>
                <div className="quantity-control">
                  <button
                    className="icon-button"
                    aria-label={`Diminuir quantidade de ${product.name}`}
                    onClick={() => update(product.id, item.quantity - 1)}
                  >
                    <Minus size={16} />
                  </button>
                  <span aria-label={`Quantidade de ${product.name}`}>
                    {item.quantity}
                  </span>
                  <button
                    className="icon-button"
                    disabled={item.quantity >= 99}
                    aria-label={`Aumentar quantidade de ${product.name}`}
                    onClick={() => update(product.id, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="cart-item-price">
                <strong>{money(product.price * item.quantity)}</strong>
                <button
                  className="remove-button"
                  onClick={() => remove(product.id)}
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
          <span>{money(subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Entrega</span>
          <span>Não calculada</span>
        </div>
        <div className="summary-total">
          <span>Subtotal</span>
          <strong>{money(subtotal)}</strong>
        </div>
        <div className="info-box">
          <Info size={20} />
          <p>
            Este carrinho é uma demonstração. Nenhum pedido será enviado,
            nenhuma entrega está disponível e não há cobrança.
          </p>
        </div>
        <Link href="/cardapio" className="button full-width">
          Adicionar mais sabores <Plus size={17} />
        </Link>
        <p className="small muted">
          Seu carrinho fica salvo somente neste navegador.
        </p>
      </aside>
    </section>
  );
}
