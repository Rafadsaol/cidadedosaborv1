"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { customerId } from "@/lib/demo";
import { money } from "@/lib/utils";
import { OrderDetails, StatusBadge } from "./order-details";
export function CustomerOrders() {
  const {
    orders,
    ready,
    profile
  } = useDemo();
  const mine = orders.filter(o => o.customerId === customerId);
  if (!ready) return <div className="container empty-state" role="status">Carregando pedidos locais…</div>;
  return <section className="container customer-orders"><div className="demo-inline-banner"><ShoppingBag size={20} /><p>Histórico do Cliente Teste, salvo somente neste navegador. Os status acompanham as alterações do administrador, inclusive entre abas do mesmo endereço.</p><Link href="/login" className="text-link">{profile ? "Trocar perfil" : "Escolher perfil"} <ArrowRight size={16} /></Link></div>
    {!mine.length ? <div className="empty-state"><ShoppingBag size={42} /><h2>Sua história começa com um sabor.</h2><p>Seu próximo pedido de teste aparecerá aqui.</p><Link href="/cardapio" className="button">Explorar cardápio</Link></div> : <div className="customer-order-list">{mine.map(order => <details className="customer-order" key={order.id}><summary><div><span className="eyebrow">{order.sample ? "EXEMPLO" : "PEDIDO DE TESTE"}</span><strong>{order.number}</strong><small>{new Date(order.createdAt).toLocaleString("pt-BR")}</small><span className="customer-order-products">{order.items.map(i => `${i.quantity}× ${i.name}`).join(" · ")}</span></div><div><StatusBadge status={order.status} /><strong>{money(order.totalCents)}</strong><small>{order.fulfillment === "delivery" ? "Delivery" : "Retirada"} · Ver detalhes</small></div></summary><OrderDetails order={order} /></details>)}</div>}
  </section>;
}
