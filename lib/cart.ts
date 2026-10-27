import { products } from "@/data/products";
import { extras, productOptions, donenessLabels } from "@/data/customization";
import type { CartItem, Product, ProductConfiguration } from "@/types";
export const CART_KEY = "cidade-do-sabor:cart:v1";
export const MAX_QUANTITY = 99;
const record = (v: unknown): Record<string, unknown> =>
  v !== null && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
export function normalizeConfiguration(
  product: Product,
  input?: unknown,
): ProductConfiguration {
  const raw = record(input);
  const options = productOptions[product.id];
  const selected = record(raw.combo);
  const combo: Record<string, string> = {};
  for (const group of options?.comboGroups || []) {
    const choice =
      group.choices.find((c) => c.id === selected[group.id] && c.available) ||
      group.choices.find((c) => c.available)!;
    combo[group.id] = choice.id;
  }
  const vegetarian = product.id === "veggie" || combo.burger === "veggie";
  const extraIds = Array.isArray(raw.extraIds)
    ? [
        ...new Set(
          raw.extraIds.filter(
            (id): id is string =>
              typeof id === "string" &&
              !!options?.extraIds.includes(id) &&
              extras.some(
                (e) =>
                  e.id === id && e.available && (!vegetarian || e.vegetarian),
              ),
          ),
        ),
      ].sort()
    : [];
  const removedIngredients = Array.isArray(raw.removedIngredients)
    ? [
        ...new Set(
          raw.removedIngredients.filter(
            (i): i is string =>
              typeof i === "string" &&
              !!options?.removableIngredients.includes(i),
          ),
        ),
      ].sort()
    : [];
  const doneness = options?.doneness
    ? typeof raw.doneness === "string" &&
      Object.hasOwn(donenessLabels, raw.doneness)
      ? (raw.doneness as keyof typeof donenessLabels)
      : "ao-ponto"
    : null;
  return {
    removedIngredients,
    extraIds,
    doneness,
    notes: typeof raw.notes === "string" ? raw.notes.trim().slice(0, 300) : "",
    combo,
  };
}
export function configurationKey(
  productId: string,
  configuration: ProductConfiguration,
) {
  return JSON.stringify([
    productId,
    configuration.removedIngredients,
    configuration.extraIds,
    configuration.doneness,
    configuration.notes,
    configuration.combo,
  ]);
}
export function unitPriceCents(
  product: Product,
  configuration: ProductConfiguration,
): number {
  const safe = normalizeConfiguration(product, configuration);
  const additional = safe.extraIds.reduce(
    (sum, id) => sum + extras.find((e) => e.id === id)!.priceCents,
    0,
  );
  const choices = (productOptions[product.id]?.comboGroups || []).reduce(
    (sum, group) =>
      sum +
      group.choices.find((c) => c.id === safe.combo[group.id])!.priceCents *
        group.quantity,
    0,
  );
  return product.priceCents + additional + choices;
}
export function configurationSummary(
  product: Product,
  configuration: ProductConfiguration,
): string[] {
  const safe = normalizeConfiguration(product, configuration);
  return [
    ...(productOptions[product.id]?.comboGroups || []).map(
      (g) =>
        `${g.name}: ${g.choices.find((c) => c.id === safe.combo[g.id])!.name}`,
    ),
    ...(safe.doneness ? [`Ponto: ${donenessLabels[safe.doneness]}`] : []),
    ...(safe.removedIngredients.length
      ? [`Sem: ${safe.removedIngredients.join(", ")}`]
      : []),
    ...safe.extraIds.map((id) => `+ ${extras.find((e) => e.id === id)!.name}`),
  ];
}
export function parseCart(input: unknown): CartItem[] {
  const object = record(input);
  const list = Array.isArray(input)
    ? input
    : object.version === 2 && Array.isArray(object.items)
      ? object.items
      : [];
  const merged = new Map<string, CartItem>();
  for (const entry of list.slice(0, 100)) {
    const value = record(entry);
    const product = products.find((p) => p.id === value.productId);
    if (
      !product ||
      !Number.isSafeInteger(value.quantity) ||
      Number(value.quantity) < 1
    )
      continue;
    const configuration = normalizeConfiguration(product, value.configuration);
    const key = configurationKey(product.id, configuration);
    const quantity = Math.min(
      MAX_QUANTITY,
      Number(value.quantity) + (merged.get(key)?.quantity || 0),
    );
    merged.set(key, { key, productId: product.id, quantity, configuration });
  }
  return [...merged.values()];
}
export function cartSubtotalCents(items: CartItem[]) {
  return items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return (
      sum +
      (product
        ? unitPriceCents(product, item.configuration) * item.quantity
        : 0)
    );
  }, 0);
}
