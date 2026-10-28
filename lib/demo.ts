import { products as initialProducts, categories } from "@/data/products";
import { checkoutSettings } from "@/data/customization";
import { normalizeConfiguration, configurationSummary, unitPriceCents } from "@/lib/cart";
import { paymentLabels, validateCheckout } from "@/lib/checkout";
import { localDate } from "@/lib/utils";
import { orderStatuses, reservationStatuses, type DemoState, type DemoOrder, type DemoReservation, type OrderStatus } from "@/types/demo";
import type { CartItem, CheckoutData, Product } from "@/types";
export const DEMO_KEY = "cidade-do-sabor:demo:v3";
export const customerId = "customer-demo";
export const reservationTimes = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
export function localId(prefix: string) {
  const value = globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${value}`;
}
export function createOrder(items: CartItem[], catalog: Product[], data: CheckoutData): DemoOrder | null {
  if (Object.keys(validateCheckout(data)).length || !items.length || items.length > 100) return null;
  const lines = items.map(item => {
    const product = catalog.find(p => p.id === item.productId && p.available !== false);
    if (!product || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) return null;
    const configuration = normalizeConfiguration(product, item.configuration);
    return {
      productId: product.id,
      name: product.name,
      quantity: item.quantity,
      unitPriceCents: unitPriceCents(product, configuration),
      details: configurationSummary(product, configuration),
      notes: configuration.notes
    };
  });
  if (lines.some(line => line === null)) return null;
  const valid = lines.filter(line => line !== null);
  const subtotalCents = valid.reduce((sum, item) => sum + item.quantity * item.unitPriceCents, 0);
  const deliveryCents = data.fulfillment === "delivery" ? checkoutSettings.deliveryFeeCents : 0;
  const id = localId("order");
  const createdAt = new Date().toISOString();
  return {
    id,
    number: `CS-${Date.now().toString(36).toUpperCase()}-${id.slice(-5).toUpperCase()}`,
    customerId,
    customerName: data.name.trim(),
    phone: data.phone.trim(),
    address: data.fulfillment === "delivery" ? `${data.street.trim()}, ${data.number.trim()}${data.complement.trim() ? ` · ${data.complement.trim()}` : ""} · ${data.neighborhood.trim()} · ${data.city.trim()}/${data.state} · CEP ${data.cep}${data.reference.trim() ? ` · Ref.: ${data.reference.trim()}` : ""}` : null,
    fulfillment: data.fulfillment,
    payment: data.payment,
    items: valid,
    subtotalCents,
    deliveryCents,
    totalCents: subtotalCents + deliveryCents,
    createdAt,
    status: "Recebido",
    history: [{
      status: "Recebido",
      at: createdAt,
      note: "Pedido de teste criado neste navegador"
    }],
    sample: false
  };
}
export function canChangeStatus(current: OrderStatus, next: OrderStatus) {
  if (current === next || current === "Cancelado" || current === "Concluído") return false;
  return next === "Cancelado" || orderStatuses.indexOf(next) === orderStatuses.indexOf(current) + 1;
}
export function updateOrderStatus(order: DemoOrder, status: OrderStatus): DemoOrder {
  if (!canChangeStatus(order.status, status)) return order;
  return {
    ...order,
    status,
    history: [...order.history, {
      status,
      at: new Date().toISOString(),
      note: "Atualizado pelo Administrador Demo"
    }]
  };
}
export function validateReservation(input: Pick<DemoReservation, "name" | "phone" | "date" | "time" | "people" | "notes">) {
  if (input.name.trim().length < 2 || input.name.length > 80) return "Informe um nome entre 2 e 80 caracteres.";
  if (!/^\d{10,11}$/.test(input.phone.replace(/\D/g, ""))) return "Informe um telefone com DDD, com 10 ou 11 dígitos.";
  if (!validDay(input.date) || !reservationTimes.includes(input.time) || new Date(`${input.date}T${input.time}:00`).getTime() <= Date.now()) return "Escolha uma data e um horário futuros para a simulação.";
  if (!Number.isInteger(input.people) || input.people < 1 || input.people > 8) return "Escolha entre 1 e 8 pessoas.";
  if (input.notes.length > 500) return "Use até 500 caracteres nas observações.";
  return "";
}
export function initialDemo(): DemoState {
  const now = new Date();
  const orders = Array.from({
    length: 14
  }, (_, i): DemoOrder => {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(i / 2));
    date.setHours(12 + i % 6, 15, 0, 0);
    const product = initialProducts[i % 6];
    const status = orderStatuses[i < 4 ? i : i === 5 ? 4 : 3];
    const quantity = i % 3 === 0 ? 2 : 1;
    const subtotalCents = product.priceCents * quantity;
    const deliveryCents = i % 2 === 0 ? checkoutSettings.deliveryFeeCents : 0;
    const createdAt = date.toISOString();
    return {
      id: `sample-order-${i}`,
      number: `EX-${String(1001 + i)}`,
      customerId: i === 0 ? customerId : `sample-customer-${i % 4}`,
      customerName: ["Cliente Teste", "Luiza Exemplo", "André Exemplo", "Júlia Exemplo"][i % 4],
      phone: "41999990000",
      address: deliveryCents ? "Rua Fictícia, 123 · Centro · Curitiba/PR" : null,
      fulfillment: deliveryCents ? "delivery" : "pickup",
      payment: "pix",
      items: [{
        productId: product.id,
        name: product.name,
        quantity,
        unitPriceCents: product.priceCents,
        details: [],
        notes: ""
      }],
      subtotalCents,
      deliveryCents,
      totalCents: subtotalCents + deliveryCents,
      createdAt,
      status,
      history: [{
        status: "Recebido",
        at: createdAt,
        note: "Dado de exemplo"
      }, ...(status !== "Recebido" ? [{
        status,
        at: createdAt,
        note: "Status de exemplo"
      }] : [])],
      sample: true
    };
  });
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  return {
    version: 3,
    profile: null,
    products: structuredClone(initialProducts),
    orders,
    reservations: [{
      id: "sample-reservation",
      customerId,
      name: "Cliente Teste",
      phone: "41999990000",
      date: localDate(tomorrow),
      time: "19:00",
      people: 2,
      notes: "Mesa fictícia de exemplo",
      status: "Pendente",
      createdAt: now.toISOString(),
      sample: true
    }]
  };
}
const record = (v: unknown): Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : {};
const text = (v: unknown, max: number) => typeof v === "string" && v.length <= max;
const cents = (v: unknown) => Number.isSafeInteger(v) && Number(v) >= 0 && Number(v) <= 1_000_000;
const timestamp = (v: unknown) => typeof v === "string" && v.length <= 40 && Number.isFinite(Date.parse(v));
const strings = (v: unknown, max: number) => Array.isArray(v) && v.length <= max && v.every(s => text(s, 500));
function validDay(v: unknown) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(`${v}T12:00:00Z`).toISOString().slice(0, 10) === v;
}
export function validProduct(input: unknown): input is Product {
  const v = record(input);
  return text(v.id, 100) && !!v.id && text(v.name, 80) && String(v.name).trim().length >= 2 && text(v.description, 500) && cents(v.priceCents) && Number(v.priceCents) > 0 && (v.originalPriceCents === undefined || cents(v.originalPriceCents)) && categories.includes(v.category as Product["category"]) && typeof v.image === "string" && /^\/images\/[a-z0-9-]+\.(png|webp|svg)$/.test(v.image) && strings(v.ingredients, 30) && (v.available === undefined || typeof v.available === "boolean") && (v.tag === undefined || text(v.tag, 50)) && (v.bestseller === undefined || typeof v.bestseller === "boolean");
}
function validOrder(input: unknown): input is DemoOrder {
  const v = record(input);
  if (!text(v.id, 100) || !v.id || !text(v.number, 80) || !text(v.customerId, 100) || !text(v.customerName, 80) || !text(v.phone, 25) || !(v.address === null || text(v.address, 1000)) || !["delivery", "pickup"].includes(String(v.fulfillment)) || !Object.hasOwn(paymentLabels, String(v.payment)) || !timestamp(v.createdAt) || !orderStatuses.includes(v.status as OrderStatus) || typeof v.sample !== "boolean" || !Array.isArray(v.items) || !v.items.length || v.items.length > 100 || !Array.isArray(v.history) || !v.history.length || v.history.length > 20 || !cents(v.deliveryCents)) return false;
  let subtotal = 0;
  for (const entry of v.items) {
    const line = record(entry);
    if (!text(line.productId, 100) || !text(line.name, 80) || !Number.isInteger(line.quantity) || Number(line.quantity) < 1 || Number(line.quantity) > 99 || !cents(line.unitPriceCents) || !strings(line.details, 40) || !text(line.notes, 300)) return false;
    subtotal += Number(line.quantity) * Number(line.unitPriceCents);
  }
  return v.history.every(h => {
    const e = record(h);
    return orderStatuses.includes(e.status as OrderStatus) && timestamp(e.at) && text(e.note, 150);
  }) && record(v.history[v.history.length - 1]).status === v.status && v.subtotalCents === subtotal && v.totalCents === subtotal + Number(v.deliveryCents);
}
function validReservation(input: unknown): input is DemoReservation {
  const v = record(input);
  return text(v.id, 100) && !!v.id && text(v.customerId, 100) && text(v.name, 80) && text(v.phone, 25) && validDay(v.date) && reservationTimes.includes(String(v.time)) && Number.isInteger(v.people) && Number(v.people) >= 1 && Number(v.people) <= 8 && text(v.notes, 500) && reservationStatuses.includes(v.status as DemoReservation["status"]) && timestamp(v.createdAt) && typeof v.sample === "boolean";
}
function unique<T extends {
  id: string;
}>(list: T[]) {
  return [...new Map(list.map(item => [item.id, item])).values()];
}
export function parseDemo(input: unknown): DemoState | null {
  const v = record(input);
  if (v.version !== 3 || !Array.isArray(v.products) || !Array.isArray(v.orders) || !Array.isArray(v.reservations)) return null;
  return {
    version: 3,
    profile: v.profile === "admin" || v.profile === "customer" ? v.profile : null,
    products: unique(v.products.slice(0, 200).filter(validProduct)),
    orders: unique(v.orders.slice(0, 500).filter(validOrder)),
    reservations: unique(v.reservations.slice(0, 500).filter(validReservation))
  };
}
export function reportData(orders: DemoOrder[], includeSamples: boolean, now = new Date()) {
  const selected = orders.filter(o => includeSamples || !o.sample);
  const completed = selected.filter(o => o.status === "Concluído");
  const revenueCents = completed.reduce((sum, o) => sum + o.totalCents, 0);
  const byProduct = new Map<string, {
    label: string;
    value: number;
  }>();
  for (const order of completed) for (const line of order.items) {
    const current = byProduct.get(line.productId) || {
      label: line.name,
      value: 0
    };
    current.value += line.quantity;
    byProduct.set(line.productId, current);
  }
  const daily = Array.from({
    length: 7
  }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const day = localDate(d);
    const matching = selected.filter(o => localDate(new Date(o.createdAt)) === day);
    return {
      label: d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit"
      }),
      count: matching.length,
      revenue: matching.filter(o => o.status === "Concluído").reduce((s, o) => s + o.totalCents, 0)
    };
  });
  return {
    orders: selected,
    today: selected.filter(o => localDate(new Date(o.createdAt)) === localDate(now)).length,
    pending: selected.filter(o => !["Concluído", "Cancelado"].includes(o.status)).length,
    completed: completed.length,
    revenueCents,
    averageCents: completed.length ? Math.round(revenueCents / completed.length) : 0,
    best: [...byProduct.values()].sort((a, b) => b.value - a.value).slice(0, 5),
    daily,
    statuses: orderStatuses.map(label => ({
      label,
      value: selected.filter(o => o.status === label).length
    }))
  };
}
