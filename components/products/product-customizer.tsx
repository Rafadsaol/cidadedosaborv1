"use client";
import { useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import { extras, productOptions, donenessLabels } from "@/data/customization";
import {
  normalizeConfiguration,
  unitPriceCents,
  configurationSummary,
} from "@/lib/cart";
import { money } from "@/lib/utils";
import { useCart } from "@/components/cart-provider";
import { QuantityControl } from "@/components/ui/quantity-control";
import type { Product, ProductConfiguration, Doneness } from "@/types";
export function ProductCustomizer({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [configuration, setConfiguration] = useState(() =>
    normalizeConfiguration(product),
  );
  const [quantity, setQuantity] = useState(1);
  const { add, ready } = useCart();
  const options = productOptions[product.id];
  const unit = unitPriceCents(product, configuration);
  const patch = (next: Partial<ProductConfiguration>) =>
    setConfiguration((current) =>
      normalizeConfiguration(product, { ...current, ...next }),
    );
  const toggle = (field: "removedIngredients" | "extraIds", id: string) =>
    patch({
      [field]: configuration[field].includes(id)
        ? configuration[field].filter((v) => v !== id)
        : [...configuration[field], id],
    });
  const vegetarian =
    product.id === "veggie" || configuration.combo.burger === "veggie";
  return (
    <form
      className="customizer"
      onSubmit={(event) => {
        event.preventDefault();
        add(product.id, configuration, quantity);
        onClose();
      }}
    >
      <div className="customizer-base">
        <span>Preço base</span>
        <strong>{money(product.priceCents)}</strong>
      </div>
      {options?.comboGroups?.map((group) => (
        <fieldset className="option-group" key={group.id}>
          <legend>
            {group.name}
            <small>
              Escolha uma opção
              {group.quantity > 1
                ? ` · acréscimos para ${group.quantity} unidades`
                : ""}
            </small>
          </legend>
          <div className="option-list">
            {group.choices.map((choice) => (
              <label
                className={`option-choice ${configuration.combo[group.id] === choice.id ? "chosen" : ""}`}
                key={choice.id}
              >
                <input
                  type="radio"
                  name={`combo-${group.id}`}
                  value={choice.id}
                  checked={configuration.combo[group.id] === choice.id}
                  disabled={!choice.available}
                  onChange={() =>
                    patch({
                      combo: { ...configuration.combo, [group.id]: choice.id },
                    })
                  }
                />
                <span>{choice.name}</span>
                <strong>
                  {choice.priceCents
                    ? `+ ${money(choice.priceCents * group.quantity)}`
                    : "Incluso"}
                </strong>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      {!!options?.removableIngredients.length && (
        <fieldset className="option-group">
          <legend>
            Retirar ingredientes
            <small>Selecione o que prefere sem · sem cobrança</small>
          </legend>
          <div className="removal-options">
            {options.removableIngredients.map((ingredient) => (
              <label key={ingredient}>
                <input
                  type="checkbox"
                  checked={configuration.removedIngredients.includes(
                    ingredient,
                  )}
                  onChange={() => toggle("removedIngredients", ingredient)}
                />{" "}
                Sem {ingredient}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {!!options?.extraIds.length && (
        <fieldset className="option-group">
          <legend>
            Deixe ainda mais seu
            <small>
              Adicionais por unidade do produto · opções compatíveis com sua
              seleção
            </small>
          </legend>
          <div className="option-list">
            {extras
              .filter((extra) => options.extraIds.includes(extra.id))
              .map((extra) => {
                const unavailable =
                  !extra.available || (vegetarian && !extra.vegetarian);
                return (
                  <label
                    className={`option-choice ${configuration.extraIds.includes(extra.id) ? "chosen" : ""}`}
                    key={extra.id}
                  >
                    <input
                      type="checkbox"
                      checked={configuration.extraIds.includes(extra.id)}
                      disabled={unavailable}
                      onChange={() => toggle("extraIds", extra.id)}
                    />
                    <span>
                      {extra.name}
                      {unavailable && (
                        <small>
                          {!extra.available
                            ? "Indisponível"
                            : "Incompatível com o hambúrguer vegetariano"}
                        </small>
                      )}
                    </span>
                    <strong>+ {money(extra.priceCents)}</strong>
                  </label>
                );
              })}
          </div>
        </fieldset>
      )}
      {options?.doneness && (
        <fieldset className="option-group">
          <legend>Ponto da carne</legend>
          <div className="doneness-options">
            {Object.entries(donenessLabels).map(([value, label]) => (
              <label
                className={configuration.doneness === value ? "chosen" : ""}
                key={value}
              >
                <input
                  type="radio"
                  name="doneness"
                  checked={configuration.doneness === value}
                  onChange={() => patch({ doneness: value as Doneness })}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <label className="customizer-notes">
        Observações <span>(opcional · até 300 caracteres)</span>
        <textarea
          name="notes"
          rows={2}
          maxLength={300}
          value={configuration.notes}
          onChange={(event) =>
            setConfiguration((current) => ({
              ...current,
              notes: event.target.value,
            }))
          }
          placeholder="Ex.: separar o molho. Não inclua dados pessoais."
        />
      </label>
      {!!options?.comboGroups && (
        <div className="configuration-preview">
          <h3>
            <SlidersHorizontal size={15} /> Seu combo
          </h3>
          <ul>
            {configurationSummary(product, configuration).map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="price-breakdown">
        <span>Adicionais e escolhas</span>
        <strong>+ {money(unit - product.priceCents)}</strong>
      </div>
      <div className="customizer-quantity">
        <span>
          Quantidade<small>Máximo de 99 por configuração</small>
        </span>
        <QuantityControl
          name={product.name}
          value={quantity}
          onChange={setQuantity}
        />
      </div>
      <div className="modal-bottom customizer-total">
        <span>
          Total<strong aria-live="polite">{money(unit * quantity)}</strong>
        </span>
        <button className="button" disabled={!ready} type="submit">
          <Plus size={18} /> Adicionar ao carrinho
        </button>
      </div>
      <p className="small muted customizer-demo">
        Personalização demonstrativa. Nenhum pedido real é enviado.
      </p>
    </form>
  );
}
