"use client";
import { useDemo } from "@/components/demo-provider";
import { checkoutSettings } from "@/data/customization";
import { unitPriceCents, cartSubtotalCents } from "@/lib/cart";
import { money } from "@/lib/utils";
import { ItemDetails } from "@/components/products/item-details";
import type { CartItem } from "@/types";
export function OrderSummary({
  items,
  delivery,
}: {
  items: CartItem[];
  delivery: boolean;
}) {
  const { products } = useDemo();
  const subtotal = cartSubtotalCents(items, products);
  const freight = delivery ? checkoutSettings.deliveryFeeCents : 0;
  return (
    <aside className="summary order-summary">
      <span className="eyebrow">SUA COMBINAÇÃO FAVORITA</span>
      <h2>Resumo da simulação</h2>
      <div className="order-lines">
        {items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return (
            <article className="order-line" key={item.key}>
              <div>
                <h3>
                  {item.quantity}× {product.name}
                </h3>
                <strong>
                  {money(
                    unitPriceCents(product, item.configuration) * item.quantity,
                  )}
                </strong>
              </div>
              <ItemDetails product={product} item={item} />
              <p className="small muted">
                Base {money(product.priceCents)} · unidade personalizada{" "}
                {money(unitPriceCents(product, item.configuration))}
              </p>
            </article>
          );
        })}
      </div>
      <div className="summary-row">
        <span>Subtotal</span>
        <strong>{money(subtotal)}</strong>
      </div>
      <div className="summary-row">
        <span>{delivery ? "Frete simulado" : "Retirada simulada"}</span>
        <strong>{money(freight)}</strong>
      </div>
      {delivery && (
        <p className="freight-note">
          {checkoutSettings.deliveryLabel}. {checkoutSettings.timeframe}.
        </p>
      )}
      <div className="summary-total">
        <span>Total demonstrativo</span>
        <strong>{money(subtotal + freight)}</strong>
      </div>
      <p className="checkout-security">
        Nenhum valor será cobrado. Não há pagamento ou envio de pedido.
      </p>
    </aside>
  );
}
