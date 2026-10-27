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
  Search,
  MapPin,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const drawer = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!open || !drawer.current) return;
    const element = drawer.current;
    element.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previous;
    };
  }, [open]);
  return (
    <>
      <header
        className={`header studio-header ${path === "/" ? "header-home" : ""}`}
      >
        <div className="container header-inner">
          <div className="header-left">
            <button
              className="icon-button studio-menu"
              aria-label="Abrir menu"
              aria-expanded={open}
              aria-controls="site-navigation"
              onClick={() => setOpen(true)}
            >
              <Menu size={23} strokeWidth={1.5} />
            </button>
            <span className="header-city">
              <MapPin size={13} /> SÃO PAULO · SP
            </span>
          </div>
          <Logo />
          <div className="header-actions">
            <Link
              href="/cardapio#product-search"
              className="icon-button search-link"
              aria-label="Buscar no cardápio"
            >
              <Search size={21} strokeWidth={1.5} />
            </Link>
            <span className="header-divider" />
            <Link
              href="/carrinho"
              className="studio-cart icon-button"
              aria-label={`Carrinho, ${ready ? count : 0} itens`}
            >
              <ShoppingBag size={21} strokeWidth={1.5} />
              <span className="cart-count">{ready ? count : 0}</span>
            </Link>
          </div>
        </div>
      </header>
      <dialog
        ref={drawer}
        className="navigation-drawer"
        aria-labelledby="navigation-title"
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="drawer-content">
          <div className="drawer-top">
            <span id="navigation-title">EXPLORE A CIDADE</span>
            <button
              className="icon-button"
              autoFocus
              aria-label="Fechar menu"
              onClick={() => setOpen(false)}
            >
              <X size={23} />
            </button>
          </div>
          <nav id="site-navigation" aria-label="Navegação principal">
            {links.map(([href, label], i) => (
              <Link
                href={href}
                key={href}
                onClick={() => setOpen(false)}
                aria-current={path === href ? "page" : undefined}
              >
                <span className="nav-number">0{i + 1}</span>
                {label}
                <ArrowUpRight size={21} />
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="drawer-account"
            >
              <UserRound size={19} /> Área do cliente <ArrowUpRight size={18} />
            </Link>
          </nav>
          <div className="drawer-footer">
            <Flame size={20} />
            <span>
              O sabor que domina a cidade.
              <small>Hamburgueria fictícia · Protótipo demonstrativo.</small>
            </span>
          </div>
        </div>
      </dialog>
    </>
  );
}
