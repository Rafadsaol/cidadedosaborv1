"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  Menu,
  X,
  ShoppingBag,
  UserRound,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Cidade do Sabor — início">
      <span className="logo-icon">
        <Flame size={29} fill="currentColor" />
      </span>
      <span>
        CIDADE
        <span className="logo-bottom">
          DO SABOR<span className="logo-dot">.</span>
        </span>
      </span>
    </Link>
  );
}
const links = [
  ["/", "Início"],
  ["/cardapio", "Cardápio"],
  ["/delivery", "Delivery"],
  ["/reservas", "Reservas"],
  ["/sobre", "Sobre nós"],
  ["/contato", "Contato"],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const { count, ready } = useCart();
  return (
    <header className="header">
      <div className="container header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={path === href ? "active" : ""}
              aria-current={path === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            href="/login"
            className="icon-button user-button"
            aria-label="Área do cliente"
          >
            <UserRound size={21} />
          </Link>
          <Link
            href="/carrinho"
            className="cart-link"
            aria-label={`Carrinho, ${ready ? count : 0} itens`}
          >
            <ShoppingBag size={19} />
            <span className="cart-label">Meu carrinho</span>
            <span className="cart-count">{ready ? count : 0}</span>
          </Link>
          <button
            className="icon-button mobile-toggle"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Navegação móvel"
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={path === href ? "page" : undefined}
            >
              {label}
              <ArrowUpRight size={16} />
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)}>
            Área do cliente <UserRound size={16} />
          </Link>
        </nav>
      )}
    </header>
  );
}
