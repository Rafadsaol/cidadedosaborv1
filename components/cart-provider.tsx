"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { products } from "@/data/products";
import type { CartItem } from "@/types";
const KEY = "cidade-do-sabor:cart:v1";
type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  count: number;
  subtotal: number;
  add: (id: string) => void;
  update: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  notice: string;
  clearNotice: () => void;
};
const CartContext = createContext<CartContextValue | null>(null);
function readCart(): CartItem[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    const merged = new Map<string, number>();
    for (const item of raw) {
      if (
        item &&
        typeof item === "object" &&
        typeof item.productId === "string" &&
        products.some((p) => p.id === item.productId) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
      )
        merged.set(
          item.productId,
          Math.min(99, (merged.get(item.productId) || 0) + item.quantity),
        );
    }
    return Array.from(merged, ([productId, quantity]) => ({
      productId,
      quantity,
    }));
  } catch {
    return [];
  }
}
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const id = setTimeout(() => {
      setItems(readCart());
      setReady(true);
    }, 0);
    const sync = (event: StorageEvent) => {
      if (event.key === KEY) setItems(readCart());
    };
    window.addEventListener("storage", sync);
    return () => {
      clearTimeout(id);
      window.removeEventListener("storage", sync);
    };
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(KEY, JSON.stringify(items));
      } catch {
        /* O carrinho continua disponível em memória. */
      }
    }
  }, [items, ready]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const add = useCallback((id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setItems((previous) => {
      const found = previous.find((i) => i.productId === id);
      return found
        ? previous.map((i) =>
            i.productId === id
              ? { ...i, quantity: Math.min(99, i.quantity + 1) }
              : i,
          )
        : [...previous, { productId: id, quantity: 1 }];
    });
    setNotice(`${product.name} adicionado ao carrinho`);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(""), 3500);
  }, []);
  const remove = (id: string) =>
    setItems((previous) => previous.filter((i) => i.productId !== id));
  const update = (id: string, quantity: number) => {
    if (quantity < 1) remove(id);
    else
      setItems((previous) =>
        previous.map((i) =>
          i.productId === id ? { ...i, quantity: Math.min(99, quantity) } : i,
        ),
      );
  };
  return (
    <CartContext.Provider
      value={{
        items,
        ready,
        count: items.reduce((sum, i) => sum + i.quantity, 0),
        subtotal: items.reduce(
          (sum, i) =>
            sum +
            (products.find((p) => p.id === i.productId)?.price || 0) *
              i.quantity,
          0,
        ),
        add,
        update,
        remove,
        notice,
        clearNotice: () => setNotice(""),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("CartProvider ausente");
  return context;
}
