"use client";
import { Search, UtensilsCrossed, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { categories } from "@/data/products";
import { useDemo } from "@/components/demo-provider";
import { ProductGrid } from "./product-grid";
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const sorts = [
  { id: "featured", name: "Destaques da casa" },
  { id: "price-asc", name: "Menor preço" },
  { id: "price-desc", name: "Maior preço" },
  { id: "name", name: "Nome (A–Z)" },
];
type Filters = { search: string; category: string; sort: string };
const defaults: Filters = { search: "", category: "Todos", sort: "featured" };
function readFilters(): Filters {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("categoria") || "Todos";
  const sort = params.get("ordem") || "featured";
  return {
    search: (params.get("q") || "").slice(0, 100),
    category: categories.some((c) => c === category) ? category : "Todos",
    sort: sorts.some((s) => s.id === sort) ? sort : "featured",
  };
}
export function Catalog() {
  const { products } = useDemo();
  const [filters, setFilters] = useState(defaults);
  useEffect(() => {
    const timer = setTimeout(() => setFilters(readFilters()), 0);
    const restore = () => setFilters(readFilters());
    window.addEventListener("popstate", restore);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("popstate", restore);
    };
  }, []);
  const change = useCallback(
    (next: Partial<Filters>, replace = false) => {
      const value = { ...filters, ...next };
      setFilters(value);
      const params = new URLSearchParams();
      if (value.search) params.set("q", value.search);
      if (value.category !== "Todos") params.set("categoria", value.category);
      if (value.sort !== "featured") params.set("ordem", value.sort);
      const url = `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`;
      if (replace) window.history.replaceState(null, "", url);
      else window.history.pushState(null, "", url);
    },
    [filters],
  );
  const filtered = useMemo(
    () =>
      products
        .filter(
          (p) =>
            (filters.category === "Todos" || p.category === filters.category) &&
            normalize(p.name).includes(normalize(filters.search.trim())),
        )
        .sort((a, b) =>
          filters.sort === "price-asc"
            ? a.priceCents - b.priceCents
            : filters.sort === "price-desc"
              ? b.priceCents - a.priceCents
              : filters.sort === "name"
                ? a.name.localeCompare(b.name, "pt-BR")
                : Number(!!b.bestseller) - Number(!!a.bestseller),
        ),
    [filters, products],
  );
  return (
    <section className="container catalog">
      <div className="catalog-toolbar">
        <div className="search-field">
          <Search size={19} />
          <label className="sr-only" htmlFor="product-search">
            Buscar pelo nome
          </label>
          <input
            id="product-search"
            type="search"
            maxLength={100}
            placeholder="Qual é a sua fome de hoje?"
            value={filters.search}
            onChange={(event) => change({ search: event.target.value }, true)}
          />
          {filters.search && (
            <button
              className="icon-button"
              aria-label="Limpar busca"
              onClick={() => change({ search: "" }, true)}
            >
              <X size={17} />
            </button>
          )}
        </div>
        <label className="catalog-sort">
          Ordenar por
          <select
            aria-label="Ordenar por"
            value={filters.sort}
            onChange={(event) => change({ sort: event.target.value })}
          >
            {sorts.map((sort) => (
              <option key={sort.id} value={sort.id}>
                {sort.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="category-list" aria-label="Filtrar por categoria">
        {["Todos", ...categories].map((category) => (
          <button
            key={category}
            className={category === filters.category ? "selected" : ""}
            aria-pressed={category === filters.category}
            onClick={() => change({ category })}
          >
            {category === "Todos" && <UtensilsCrossed size={16} />}
            {category}
          </button>
        ))}
      </div>
      <p className="result-count" aria-live="polite">
        {filtered.length}{" "}
        {filtered.length === 1 ? "delícia encontrada" : "delícias encontradas"}
      </p>
      {filtered.length ? (
        <ProductGrid products={filtered} />
      ) : (
        <div className="empty-state">
          <Search size={42} />
          <h2>Nenhum sabor por aqui… ainda.</h2>
          <p>Tente outro nome ou explore todas as categorias.</p>
          <button className="button" onClick={() => change(defaults)}>
            Limpar filtros
          </button>
        </div>
      )}
      <p className="demo-caption">
        Cardápio fictício. Imagens ilustrativas, preços e promoções
        demonstrativos.
      </p>
    </section>
  );
}
