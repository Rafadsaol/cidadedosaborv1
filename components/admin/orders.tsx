"use client";

import { useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { canChangeStatus } from "@/lib/demo";
import { orderStatuses, type DemoOrder } from "@/types/demo";
import { money } from "@/lib/utils";
import { AdminHeading } from "./admin-shell";
import { OrderDetails, StatusBadge } from "@/components/orders/order-details";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
export function AdminOrders() {
  const {
    orders,
    changeStatus
  } = useDemo();
  const [status, setStatus] = useState("Todos");
  const [search, setSearch] = useState("");
  const [cancel, setCancel] = useState<DemoOrder | null>(null);
  const filtered = orders.filter(o => (status === "Todos" || o.status === status) && `${o.number} ${o.customerName}`.toLocaleLowerCase("pt-BR").includes(search.trim().toLocaleLowerCase("pt-BR")));
  return <div className="admin-page"><AdminHeading eyebrow="DO BALCÃO À ÚLTIMA MORDIDA" title="Pedidos sob controle." description="Acompanhe cada etapa dos pedidos locais. O cliente verá as atualizações no mesmo navegador." />
    <div className="admin-filters"><label>Buscar pedido ou cliente<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Número ou nome fictício" maxLength={100} /></label><label>Status<select value={status} onChange={e => setStatus(e.target.value)}>{["Todos", ...orderStatuses].map(s => <option key={s}>{s}</option>)}</select></label><span>{filtered.length} pedidos</span></div>
    <div className="admin-order-list">{filtered.map(order => {
        const next = orderStatuses[orderStatuses.indexOf(order.status) + 1];
        return <article className="admin-panel admin-order" key={order.id}><div className="admin-order-header"><div><span className="eyebrow">{order.sample ? "DADO DE EXEMPLO" : "PEDIDO DE TESTE"}</span><h2>{order.number}</h2><p>{order.customerName} · {new Date(order.createdAt).toLocaleString("pt-BR")}</p></div><div><StatusBadge status={order.status} /><strong>{money(order.totalCents)}</strong></div></div><p className="order-product-preview">{order.items.map(i => `${i.quantity}× ${i.name}`).join(" · ")} · {order.fulfillment === "delivery" ? "Delivery" : "Retirada"}</p><div className="admin-order-actions">{next && next !== "Cancelado" && canChangeStatus(order.status, next) && <button className="button" onClick={() => changeStatus(order.id, next)}>Avançar para {next}</button>}{canChangeStatus(order.status, "Cancelado") && <button className="button button-outline" onClick={() => setCancel(order)}>Cancelar pedido</button>}</div><details className="admin-order-details"><summary>Ver detalhes e histórico de {order.number}</summary><OrderDetails order={order} /></details></article>;
      })}{!filtered.length && <div className="admin-panel admin-empty"><h2>Nenhum pedido por aqui.</h2><p>Experimente outro filtro ou crie um pedido de teste na loja.</p></div>}</div>
    <ConfirmDialog open={!!cancel} onClose={() => setCancel(null)} onConfirm={() => {
      if (cancel) changeStatus(cancel.id, "Cancelado");
    }} title="Cancelar pedido de teste?" description={`O pedido ${cancel?.number || ""} será cancelado localmente. Essa etapa é final e ficará registrada no histórico.`} confirmLabel="Sim, cancelar pedido" cancelLabel="Manter pedido" />
  </div>;
}
