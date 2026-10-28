"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, RotateCcw, X } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { categories, products as initialProducts } from "@/data/products";
import { localId } from "@/lib/demo";
import { money } from "@/lib/utils";
import type { Product } from "@/types";
import { AdminHeading } from "./admin-shell";
import { FoodImage } from "@/components/ui/food-image";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
function ProductEditor({
  product,
  onClose
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const {
    saveProduct
  } = useDemo();
  const [error, setError] = useState("");
  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      el?.close();
      document.body.style.overflow = previous;
    };
  }, []);
  return <dialog ref={dialog} className="product-editor" onCancel={onClose} aria-labelledby="product-editor-title" onClick={e => {
    if (e.target === e.currentTarget) onClose();
  }}><div className="editor-header"><div><span className="eyebrow">CARDÁPIO LOCAL</span><h2 id="product-editor-title">{product ? "Editar produto" : "Novo sabor na cidade"}</h2></div><button className="icon-button" onClick={onClose} aria-label="Fechar edição" autoFocus><X size={22} /></button></div><form className="admin-form" onSubmit={e => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const price = String(data.get("price")).trim();
      if (!/^\d{1,5}([.,]\d{1,2})?$/.test(price)) {
        setError("Informe um preço válido, como 29,90.");
        return;
      }
      const [whole, fraction = ""] = price.replace(",", ".").split(".");
      const priceCents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
      if (priceCents < 1 || priceCents > 1_000_000) {
        setError("O preço deve ser de R$ 0,01 a R$ 10.000,00.");
        return;
      }
      const next: Product = {
        ...(product || {}),
        id: product?.id || localId("product"),
        name: String(data.get("name")).trim(),
        description: String(data.get("description")).trim(),
        priceCents,
        category: String(data.get("category")) as Product["category"],
        image: String(data.get("image")),
        ingredients: [...new Set(String(data.get("ingredients")).split(",").map(i => i.trim()).filter(Boolean))],
        available: data.get("available") === "on"
      };
      if (next.originalPriceCents && next.originalPriceCents <= priceCents) delete next.originalPriceCents;
      if (!saveProduct(next)) {
        setError("Revise os dados. São permitidos até 200 produtos e 30 ingredientes por produto.");
        return;
      }
      onClose();
    }}><label>Nome do produto<input name="name" required minLength={2} maxLength={80} defaultValue={product?.name} placeholder="Burger da Cidade" /></label><label>Descrição<textarea name="description" rows={3} required maxLength={500} defaultValue={product?.description} /></label><div className="admin-form-grid"><label>Preço em reais<input name="price" inputMode="decimal" required defaultValue={product ? (product.priceCents / 100).toFixed(2).replace(".", ",") : ""} placeholder="29,90" /></label><label>Categoria<select name="category" defaultValue={product?.category || "Hambúrgueres"}>{categories.map(c => <option key={c}>{c}</option>)}</select></label></div><label>Imagem ilustrativa<select name="image" defaultValue={product?.image || initialProducts[0].image}>{[...new Map(initialProducts.map(p => [p.image, p])).values()].map(p => <option key={p.image} value={p.image}>{p.name}</option>)}</select></label><label>Ingredientes (separados por vírgula)<textarea name="ingredients" rows={2} maxLength={1000} defaultValue={product?.ingredients.join(", ")} placeholder="Pão brioche, carne, cheddar" /></label><label className="sample-switch"><input type="checkbox" name="available" defaultChecked={product?.available !== false} /> Disponível para pedidos de teste</label><p className="small muted">Imagens locais ilustrativas. Novos hambúrgueres e combos usam as opções de personalização padrão da casa.</p>{error && <p className="form-error" role="alert">{error}</p>}<button className="button full-width" type="submit">Salvar produto</button></form></dialog>;
}
export function AdminProducts() {
  const {
    products,
    saveProduct,
    deleteProduct,
    restoreProducts
  } = useDemo();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState<Product | "restore" | null>(null);
  const filtered = products.filter(p => p.name.toLocaleLowerCase("pt-BR").includes(search.trim().toLocaleLowerCase("pt-BR")));
  return <div className="admin-page"><AdminHeading eyebrow="SABORES COM A SUA ASSINATURA" title="Seu cardápio, vivo." description="Cadastre e ajuste produtos fictícios. As alterações aparecem imediatamente na loja deste navegador." action={<button className="button" onClick={() => {
      setEditing(null);
      setOpen(true);
    }}><Plus size={18} /> Novo produto</button>} />
    <div className="admin-filters"><label>Buscar produto<input type="search" value={search} onChange={e => setSearch(e.target.value)} maxLength={100} placeholder="Nome do sabor" /></label><span>{products.length} produtos · {products.filter(p => p.available !== false).length} disponíveis</span><button className="button button-outline" onClick={() => setConfirm("restore")}><RotateCcw size={16} /> Restaurar cardápio</button></div>
    <div className="admin-product-grid">{filtered.map(p => <article className="admin-panel admin-product" key={p.id}><div className="admin-product-photo"><FoodImage src={p.image} alt={p.name} sizes="(max-width: 640px) 85vw, 300px" /></div><span className="eyebrow">{p.category}</span><h2>{p.name}</h2><p>{p.description}</p><div className="admin-product-price"><strong>{money(p.priceCents)}</strong><span className={`status-badge ${p.available === false ? "cancelled" : "done"}`}>{p.available === false ? "Indisponível" : "Disponível"}</span></div><div className="admin-product-actions"><button className="button button-outline" onClick={() => {
            setEditing(p);
            setOpen(true);
          }} aria-label={`Editar ${p.name}`}><Pencil size={16} /> Editar</button><button className="icon-button remove-button" onClick={() => setConfirm(p)} aria-label={`Excluir ${p.name}`}><Trash2 size={18} /></button></div><button className="text-link small" onClick={() => saveProduct({
          ...p,
          available: p.available === false
        })}>{p.available === false ? "Tornar disponível" : "Marcar como indisponível"}</button></article>)}{!filtered.length && <div className="admin-panel admin-empty"><h2>Nenhum produto encontrado.</h2><p>Cadastre um novo sabor ou restaure o cardápio de exemplo.</p></div>}</div>
    {open && <ProductEditor product={editing} onClose={() => setOpen(false)} />}
    <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => {
      if (confirm === "restore") restoreProducts();else if (confirm) deleteProduct(confirm.id);
    }} title={confirm === "restore" ? "Restaurar o cardápio?" : "Excluir produto local?"} description={confirm === "restore" ? "Isso apagará cadastros, edições e exclusões locais do cardápio e recuperará os 12 produtos de exemplo. Pedidos e reservas serão mantidos." : `O produto ${confirm ? confirm.name : ""} será removido da loja e do carrinho. O histórico de pedidos será mantido.`} confirmLabel={confirm === "restore" ? "Sim, restaurar cardápio" : "Sim, excluir produto"} cancelLabel="Manter alterações" />
  </div>;
}
