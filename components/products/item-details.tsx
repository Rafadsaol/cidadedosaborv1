import { configurationSummary } from "@/lib/cart";
import { extras } from "@/data/customization";
import { money } from "@/lib/utils";
import type { CartItem, Product } from "@/types";
export function ItemDetails({
  product,
  item,
}: {
  product: Product;
  item: CartItem;
}) {
  const summary = configurationSummary(product, item.configuration);
  return (
    <div className="item-details">
      {!!summary.length && (
        <ul>
          {summary.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      )}
      {!!item.configuration.extraIds.length && (
        <p className="item-extra-prices">
          {item.configuration.extraIds
            .map((id) => {
              const extra = extras.find((e) => e.id === id)!;
              return `${extra.name}: + ${money(extra.priceCents)}`;
            })
            .join(" · ")}{" "}
          <span>(por unidade)</span>
        </p>
      )}
      {item.configuration.notes && (
        <p className="item-notes">
          <strong>Observação:</strong> {item.configuration.notes}
        </p>
      )}
    </div>
  );
}
