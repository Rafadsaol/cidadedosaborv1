"use client";

import { UsersRound } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { AdminHeading } from "./admin-shell";
import { money } from "@/lib/utils";
import { customerId } from "@/lib/demo";
export function AdminCustomers() {
  const {
    orders,
    reservations
  } = useDemo();
  const ids = [...new Set([customerId, ...orders.map(o => o.customerId), ...reservations.map(r => r.customerId)])];
  return <div className="admin-page"><AdminHeading eyebrow="PESSOAS QUE DÃO SABOR À CIDADE" title="Clientes demonstrativos." description="Perfis fictícios agrupados pelo identificador local. Não são cadastros ou contas reais." /><div className="admin-customer-grid">{ids.map(id => {
        const mine = orders.filter(o => o.customerId === id);
        const bookings = reservations.filter(r => r.customerId === id);
        const name = id === customerId ? "Cliente Teste" : mine[0]?.customerName || bookings[0]?.name || "Cliente Exemplo";
        const completed = mine.filter(o => o.status === "Concluído");
        return <article className="admin-panel customer-card" key={id}><span className="customer-avatar"><UsersRound size={26} /></span><span className="eyebrow">{id === customerId ? "PERFIL CLIENTE DEMO" : "PERFIL DE EXEMPLO"}</span><h2>{name}</h2><p>{mine.length} pedidos locais · {bookings.length} reservas</p><strong>{money(completed.reduce((sum, o) => sum + o.totalCents, 0))}</strong><small>Valor fictício em pedidos concluídos</small></article>;
      })}</div></div>;
}
