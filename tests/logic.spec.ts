import { test, expect } from "@playwright/test";
import { products } from "@/data/products";
import {
  normalizeConfiguration,
  unitPriceCents,
  configurationKey,
  parseCart,
  cartSubtotalCents,
} from "@/lib/cart";
import { emptyCheckout, validateCheckout } from "@/lib/checkout";
const product = (id: string) => products.find((p) => p.id === id)!;
test("preços e multiplicações permanecem em centavos inteiros", () => {
  const p = product("cidade");
  const configuration = normalizeConfiguration(p, {
    extraIds: ["bacon", "cheddar"],
    removedIngredients: ["Tomate"],
  });
  expect(unitPriceCents(p, configuration)).toBe(3890);
  expect(
    cartSubtotalCents(
      parseCart([{ productId: p.id, quantity: 3, configuration }]),
    ),
  ).toBe(11670);
  expect(products.every((p) => Number.isSafeInteger(p.priceCents))).toBe(true);
});
test("combos somam escolhas e adicionais sem duplicar preço base", () => {
  const p = product("combo");
  const config = normalizeConfiguration(p, {
    combo: { burger: "duplo", fries: "loaded", drink: "lemonade" },
    extraIds: ["cheddar"],
  });
  expect(unitPriceCents(p, config)).toBe(7190);
  const double = product("dupla");
  expect(
    unitPriceCents(
      double,
      normalizeConfiguration(double, { combo: config.combo }),
    ),
  ).toBe(13090);
});
test("configurações equivalentes agrupam, diferenças permanecem separadas", () => {
  const p = product("cidade");
  const a = normalizeConfiguration(p, {
    extraIds: ["bacon", "cheddar"],
    notes: "  Separar molho  ",
  });
  const b = normalizeConfiguration(p, {
    extraIds: ["cheddar", "bacon", "bacon"],
    notes: "Separar molho",
  });
  expect(configurationKey(p.id, a)).toBe(configurationKey(p.id, b));
  const cart = parseCart([
    { productId: p.id, quantity: 1, configuration: a },
    { productId: p.id, quantity: 2, configuration: b },
    { productId: p.id, quantity: 1 },
  ]);
  expect(cart).toHaveLength(2);
  expect(cart[0].quantity).toBe(3);
});
test("opções adulteradas, incompatíveis ou indisponíveis são descartadas", () => {
  const p = product("veggie");
  const config = normalizeConfiguration(p, {
    extraIds: ["bacon", "patty", "onion", "cheddar", "forged"],
    removedIngredients: ["forged", "Tomate"],
    doneness: "mal-passado",
    notes: "a".repeat(400),
  });
  expect(config.extraIds).toEqual(["cheddar"]);
  expect(config.removedIngredients).toEqual(["Tomate"]);
  expect(config.doneness).toBeNull();
  expect(config.notes).toHaveLength(300);
  const combo = normalizeConfiguration(product("combo"), {
    combo: { burger: "veggie", fries: "rustic", drink: "forged" },
    extraIds: ["bacon", "cheddar"],
  });
  expect(combo.combo).toEqual({
    burger: "veggie",
    fries: "classic",
    drink: "cola",
  });
  expect(combo.extraIds).toEqual(["cheddar"]);
});
test("carrinho V1 migra e preços persistidos não são confiados", () => {
  const legacy = parseCart([
    { productId: "cidade", quantity: 2, priceCents: 1 },
    { productId: "missing", quantity: 99 },
  ]);
  expect(legacy).toHaveLength(1);
  expect(cartSubtotalCents(legacy)).toBe(5980);
  const stored = parseCart({
    version: 2,
    items: [
      {
        productId: "cidade",
        quantity: 1,
        configuration: { extraIds: ["cheddar"] },
        unitPriceCents: 1,
        key: "forged",
      },
    ],
  });
  expect(cartSubtotalCents(stored)).toBe(3390);
  expect(stored[0].key).not.toBe("forged");
});
test("quantidades e formato do armazenamento são validados", () => {
  expect(parseCart(null)).toEqual([]);
  expect(parseCart({ version: 999, items: [] })).toEqual([]);
  const invalid = [-1, 0, 1.5, "2", null, Infinity].map((quantity) => ({
    productId: "cidade",
    quantity,
  }));
  expect(parseCart(invalid)).toEqual([]);
  expect(parseCart([{ productId: "cidade", quantity: 1000 }])[0].quantity).toBe(
    99,
  );
});
test("checkout exige endereço no delivery e dispensa na retirada", () => {
  const pickup = {
    ...emptyCheckout,
    name: "Teste",
    phone: "11999999999",
    fulfillment: "pickup" as const,
  };
  expect(validateCheckout(pickup)).toEqual({});
  const errors = validateCheckout({ ...pickup, fulfillment: "delivery" });
  expect(errors.cep).toBeTruthy();
  expect(errors.street).toBeTruthy();
  expect(errors.state).toBeTruthy();
  expect(
    validateCheckout({
      ...pickup,
      fulfillment: "delivery",
      cep: "01001-000",
      street: "Rua fictícia",
      number: "S/N",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
    }),
  ).toEqual({});
});

test("V3 preserva snapshots e centavos ao criar pedidos locais", async () => {
  const { createOrder } = await import("@/lib/demo");
  const cart = parseCart([{ productId: "cidade", quantity: 2, configuration: { extraIds: ["cheddar"] } }]);
  const order = createOrder(cart, products, { ...emptyCheckout, name: "Teste", phone: "41999990000", fulfillment: "pickup" });
  expect(order?.totalCents).toBe(6780);
  expect(order?.status).toBe("Recebido");
  expect(order?.items[0].details).toContain("+ Cheddar extra");
  const changed = products.map(p => ({ ...p, priceCents: 100 }));
  expect(createOrder(cart, changed, { ...emptyCheckout, name: "Teste", phone: "41999990000", fulfillment: "pickup" })?.totalCents).toBe(1000);
  expect(order?.totalCents).toBe(6780);
  expect(createOrder(cart, [], { ...emptyCheckout, name: "Teste", phone: "41999990000", fulfillment: "pickup" })).toBeNull();
});
test("V3 valida dados persistidos, transições finais e relatórios", async () => {
  const { initialDemo, parseDemo, updateOrderStatus, reportData } = await import("@/lib/demo");
  const state = initialDemo();
  expect(parseDemo(state)).toEqual(state);
  expect(parseDemo({ version: 9 })).toBeNull();
  const forged = structuredClone(state); forged.orders[0].totalCents = 1;
  expect(parseDemo(forged)?.orders.length).toBe(state.orders.length - 1);
  const received = state.orders[0];
  expect(updateOrderStatus(received, "Concluído")).toEqual(received);
  const preparing = updateOrderStatus(received, "Em preparação");
  expect(preparing.history).toHaveLength(received.history.length + 1);
  const cancelled = updateOrderStatus(preparing, "Cancelado");
  expect(updateOrderStatus(cancelled, "Recebido")).toEqual(cancelled);
  expect(reportData(state.orders, false).revenueCents).toBe(0);
  const report = reportData(state.orders, true);
  expect(report.revenueCents).toBe(state.orders.filter(o => o.status === "Concluído").reduce((sum, o) => sum + o.totalCents, 0));
  expect(report.statuses.reduce((sum, s) => sum + s.value, 0)).toBe(14);
});
test("V3 produtos criados localmente funcionam no carrinho e na personalização", async () => {
  const { validProduct } = await import("@/lib/demo");
  const custom = { ...product("cidade"), id: "burger-novo", name: "Novo Burger", priceCents: 4590 };
  expect(validProduct(custom)).toBe(true);
  expect(validProduct({ ...custom, image: "https://external.example/photo.jpg" })).toBe(false);
  const configuration = normalizeConfiguration(custom, { extraIds: ["bacon"] });
  const cart = parseCart([{ productId: custom.id, quantity: 1, configuration }], [custom]);
  expect(cartSubtotalCents(cart, [custom])).toBe(5090);
  expect(parseCart(cart, [{ ...custom, available: false }])).toEqual([]);
  expect(normalizeConfiguration({ ...custom, category: "Bebidas" }, configuration).extraIds).toEqual([]);
  expect(normalizeConfiguration({ ...product("combo"), category: "Bebidas" }).combo).toEqual({});
});
