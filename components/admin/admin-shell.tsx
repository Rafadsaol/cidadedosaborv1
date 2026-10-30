"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, CalendarDays, Users, ChartNoAxesCombined, Settings, ArrowUpRight, LogOut, Menu, X, FlaskConical, ShieldCheck } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { Logo } from "@/components/layout/header";
const navigation = [{
  href: "/admin",
  label: "Dashboard",
  Icon: LayoutDashboard
}, {
  href: "/admin/pedidos",
  label: "Pedidos",
  Icon: ShoppingBag
}, {
  href: "/admin/produtos",
  label: "Cardápio",
  Icon: UtensilsCrossed
}, {
  href: "/admin/reservas",
  label: "Reservas",
  Icon: CalendarDays
}, {
  href: "/admin/clientes",
  label: "Clientes demonstrativos",
  Icon: Users
}, {
  href: "/admin/relatorios",
  label: "Relatórios",
  Icon: ChartNoAxesCombined
}, {
  href: "/admin/configuracoes",
  label: "Configurações",
  Icon: Settings
}];
export function AdminShell({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    profile,
    ready,
    login
  } = useDemo();
  const path = usePathname().replace(/\/+$/, "") || "/";
  const [open, setOpen] = useState(false);
  if (!ready) return <div className="container empty-state" role="status">Preparando a operação demonstrativa…</div>;
  if (profile !== "admin") return <section className="container admin-access"><ShieldCheck size={48} /><span className="eyebrow">ÁREA DE DEMONSTRAÇÃO</span><h1>Explore o outro lado do balcão.</h1><p>Escolha o perfil Administrador Demo para conhecer o painel. Esta escolha simula permissões e não oferece autenticação ou segurança real.</p><Link href="/login" className="button">Escolher perfil demo <ArrowUpRight size={18} /></Link><Link href="/" className="text-link">Voltar à loja</Link></section>;
  return <div className="admin-app">
    <header className="admin-mobile-header"><Logo /><button className="icon-button" aria-label={open ? "Fechar navegação administrativa" : "Abrir navegação administrativa"} aria-expanded={open} aria-controls="admin-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></header>
    <aside className={`admin-sidebar ${open ? "is-open" : ""}`}><div className="admin-brand"><Logo /><span>OPERAÇÃO DEMONSTRATIVA</span></div><nav id="admin-navigation" aria-label="Administração">{navigation.map(({
          href,
          label,
          Icon
        }) => <Link href={href} key={href} aria-current={path === href ? "page" : undefined} onClick={() => setOpen(false)}><Icon size={19} />{label}{path === href && <span className="nav-active-dot" />}</Link>)}</nav><div className="admin-sidebar-bottom"><Link href="/" className="admin-store-link">Ver a loja <ArrowUpRight size={17} /></Link><div className="admin-user"><span>AD</span><div><strong>Administrador</strong><small>Perfil demo · sem senha</small></div></div><Link href="/login" className="text-link small">Trocar perfil</Link><button className="text-link small" onClick={() => login(null)}><LogOut size={15} /> Sair do perfil</button></div></aside>
    <div className="admin-workspace"><div className="admin-topbar"><span>CIDADE DO SABOR <span>/</span> {navigation.find(item => item.href === path)?.label}</span><span className="admin-live"><span /> Dados locais</span></div><div className="admin-demo-banner"><FlaskConical size={17} /><p><strong>Ambiente demonstrativo.</strong> Pedidos, receitas, clientes e reservas são fictícios. Alterações ficam neste navegador.</p></div>{children}</div>
  </div>;
}
export function AdminHeading({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return <div className="admin-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}
