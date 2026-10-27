"use client";
import { Search, SlidersHorizontal, UtensilsCrossed, X } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, products } from "@/data/products";
import { ProductGrid } from "./product-grid";
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function Catalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "Todos" || p.category === category) &&
          normalize(p.name).includes(normalize(search.trim())),
      ),
    [search, category],
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
            placeholder="Qual é a sua fome de hoje?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="icon-button"
              aria-label="Limpar busca"
              onClick={() => setSearch("")}
            >
              <X size={17} />
            </button>
          )}
        </div>
        <span className="catalog-hint">
          <SlidersHorizontal size={17} /> Feito na hora. Do seu jeito.
        </span>
      </div>
      <div className="category-list" aria-label="Filtrar por categoria">
        {["Todos", ...categories].map((c) => (
          <button
            key={c}
            className={c === category ? "selected" : ""}
            aria-pressed={c === category}
            onClick={() => setCategory(c)}
          >
            {c === "Todos" && <UtensilsCrossed size={16} />}
            {c}
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
          <button
            className="button"
            onClick={() => {
              setSearch("");
              setCategory("Todos");
            }}
          >
            Limpar filtros
          </button>
        </div>
      )}
      <p className="demo-caption">
        Cardápio fictício. Imagens ilustrativas e preços demonstrativos.
      </p>
    </section>
  );
}
