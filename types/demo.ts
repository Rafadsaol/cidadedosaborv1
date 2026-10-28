import type { CheckoutData, Product } from "@/types";
export type DemoRole = "customer" | "admin";
export const orderStatuses = ["Recebido", "Em preparação", "Pronto", "Concluído", "Cancelado"] as const;
export type OrderStatus = (typeof orderStatuses)[number];
export interface OrderLine {
  productId: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  details: string[];
  notes: string;
}
export interface DemoOrder {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  phone: string;
  address: string | null;
  fulfillment: CheckoutData["fulfillment"];
  payment: CheckoutData["payment"];
  items: OrderLine[];
  subtotalCents: number;
  deliveryCents: number;
  totalCents: number;
  createdAt: string;
  status: OrderStatus;
  history: {
    status: OrderStatus;
    at: string;
    note: string;
  }[];
  sample: boolean;
}
export const reservationStatuses = ["Pendente", "Confirmada", "Cancelada"] as const;
export interface DemoReservation {
  id: string;
  customerId: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  people: number;
  notes: string;
  status: (typeof reservationStatuses)[number];
  createdAt: string;
  sample: boolean;
}
export interface DemoState {
  version: 3;
  profile: DemoRole | null;
  products: Product[];
  orders: DemoOrder[];
  reservations: DemoReservation[];
}
