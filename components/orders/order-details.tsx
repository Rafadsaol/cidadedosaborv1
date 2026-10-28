"use client";

import type { DemoOrder, OrderStatus } from "@/types/demo";
import { orderStatuses } from "@/types/demo";
import { money } from "@/lib/utils";
import { paymentLabels } from "@/lib/checkout";
export function StatusBadge({
  status
}: {
  status: string;
}) {
  const kind = status === "Cancelado" || status === "Cancelada" ? "cancelled" : status === "Concluído" || status === "Confirmada" ? "done" : status === "Pronto" ? "ready" : "pending";
  return <span className={`status-badge ${kind}`}>{status}</span>;
}
export function OrderDetails({
  order
}: {
  order: DemoOrder;
}) {
  return <div className="order-detail-content">
    <div className="order-detail-top"><div><span className="eyebrow">{order.sample ? "DADO DE EXEMPLO" : "PEDIDO DE TESTE"}</span><h3>{order.number}</h3><p>{new Date(order.createdAt).toLocaleString("pt-BR")}</p></div><StatusBadge status={order.status} /></div>
    <ol className="order-progress" aria-label="Etapas do pedido">{orderStatuses.slice(0, 4).map((status, i) => <li key={status} className={order.status !== "Cancelado" && orderStatuses.indexOf(order.status as OrderStatus) >= i ? "reached" : ""}><span>{i + 1}</span>{status}</li>)}</ol>
    {order.status === "Cancelado" && <p className="demo-cancelled">Este pedido de teste foi cancelado.</p>}
    <div className="order-lines">{order.items.map((item, index) => <article className="order-line" key={index}><div><h3>{item.quantity}× {item.name}</h3><strong>{money(item.unitPriceCents * item.quantity)}</strong></div><p>{money(item.unitPriceCents)} por unidade</p>{item.details.length > 0 && <ul className="item-details">{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul>}{item.notes && <p>Observações: {item.notes}</p>}</article>)}</div>
    <div className="order-info-grid"><div><h4>Cliente e recebimento</h4><p>{order.customerName} · {order.phone}</p><p>{order.fulfillment === "delivery" ? "Delivery simulado" : "Retirada no balcão simulada"}</p>{order.address && <p>{order.address}</p>}</div><div><h4>Pagamento ilustrativo</h4><p>{paymentLabels[order.payment]} · sem cobrança</p><p>Subtotal: {money(order.subtotalCents)}</p><p>Frete simulado: {money(order.deliveryCents)}</p><strong className="order-total">Total: {money(order.totalCents)}</strong></div></div>
    <h4>Histórico de alterações</h4><ol className="order-timeline">{order.history.map((event, i) => <li key={i}><span>{event.status}</span><small>{new Date(event.at).toLocaleString("pt-BR")} · {event.note}</small></li>)}</ol>
    <p className="demo-caption">Nenhum pedido foi enviado ao restaurante. Nenhum pagamento ou entrega real será realizado.</p>
  </div>;
}
