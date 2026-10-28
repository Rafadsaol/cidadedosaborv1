"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Clock3, CheckCircle2, Wallet, ArrowUpRight, ReceiptText } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { reportData } from "@/lib/demo";
import { money } from "@/lib/utils";
import { AdminHeading } from "./admin-shell";
import { DailyChart, BarChart } from "./charts";
import { StatusBadge } from "@/components/orders/order-details";
export function Dashboard({
  reports = false
}: {
  reports?: boolean;
}) {
  const {
    orders
  } = useDemo();
  const [samples, setSamples] = useState(true);
  const report = reportData(orders, samples);
  const stats = [{
    label: "Pedidos do dia",
    value: String(report.today),
    Icon: ShoppingBag,
    note: "Criados hoje"
  }, {
    label: "Pedidos pendentes",
    value: String(report.pending),
    Icon: Clock3,
    note: "Recebidos, em preparo e prontos"
  }, {
    label: "Pedidos concluídos",
    value: String(report.completed),
    Icon: CheckCircle2,
    note: "Todo o histórico local"
  }, {
    label: "Faturamento fictício",
    value: money(report.revenueCents),
    Icon: Wallet,
    note: "Somente concluídos · inclui frete"
  }, {
    label: "Ticket médio fictício",
    value: money(report.averageCents),
    Icon: ReceiptText,
    note: "Receita ÷ pedidos concluídos"
  }];
  return <div className="admin-page"><AdminHeading eyebrow={reports ? "NÚMEROS PARA EXPLORAR" : "BEM-VINDO AO OUTRO LADO DO BALCÃO"} title={reports ? "Relatórios da cidade." : "Sua operação, em um olhar."} description="Uma visão dos exemplos e dos testes feitos neste navegador." action={<Link href="/admin/pedidos" className="button">Gerenciar pedidos <ArrowUpRight size={17} /></Link>} />
    <label className="sample-switch"><input type="checkbox" checked={samples} onChange={e => setSamples(e.target.checked)} /> Incluir dados de exemplo <span>{orders.filter(o => o.sample).length} exemplos · {orders.filter(o => !o.sample).length} testes</span></label>
    <div className="admin-stat-grid">{stats.map(({
        label,
        value,
        Icon,
        note
      }) => <article className="admin-stat" key={label}><span className="stat-label"><span>{label}</span><Icon size={19} /></span><strong>{value}</strong><small>{note}</small></article>)}</div>
    <div className="admin-chart-grid"><section className="admin-panel"><div className="panel-heading"><div><h2>Pedidos por dia</h2><p>Últimos 7 dias · {samples ? "exemplos e testes" : "apenas seus testes"}</p></div><span className="chart-label">VOLUME LOCAL</span></div><DailyChart title="Pedidos por dia" data={report.daily.map(d => ({
          label: d.label,
          value: d.count
        }))} /></section><section className="admin-panel"><div className="panel-heading"><div><h2>Os favoritos da cidade</h2><p>Unidades em pedidos concluídos · todo o histórico</p></div></div><BarChart title="Produtos mais vendidos" data={report.best} /></section>
    <section className="admin-panel"><div className="panel-heading"><div><h2>Faturamento fictício</h2><p>Últimos 7 dias · pedidos concluídos, incluindo frete</p></div></div><DailyChart title="Faturamento fictício" data={report.daily.map(d => ({
          label: d.label,
          value: d.revenue
        }))} currency /></section><section className="admin-panel"><div className="panel-heading"><div><h2>Distribuição de status</h2><p>Todos os pedidos do histórico selecionado</p></div></div><BarChart title="Distribuição de status" data={report.statuses} color="#E34B35" /></section></div>
    {!reports && <section className="admin-panel"><div className="panel-heading"><div><h2>Movimento recente</h2><p>Os últimos pedidos de exemplo e teste</p></div><Link href="/admin/pedidos" className="text-link">Ver todos <ArrowUpRight size={16} /></Link></div><div className="recent-orders">{report.orders.slice(0, 5).map(o => <Link href="/admin/pedidos" key={o.id}><div><strong>{o.number}</strong><small>{o.customerName} · {o.sample ? "Exemplo" : "Teste"}</small></div><StatusBadge status={o.status} /><strong>{money(o.totalCents)}</strong></Link>)}{!report.orders.length && <p className="admin-empty">Nenhum pedido local. Faça um teste na loja para começar.</p>}</div></section>}
  </div>;
}
