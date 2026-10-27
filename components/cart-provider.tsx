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
import {
  CART_KEY,
  MAX_QUANTITY,
  cartSubtotalCents,
  configurationKey,
  normalizeConfiguration,
  parseCart,
} from "@/lib/cart";
import type { CartItem, ProductConfiguration } from "@/types";
type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  count: number;
  subtotalCents: number;
  add: (
    id: string,
    configuration?: Partial<ProductConfiguration>,
    quantity?: number,
  ) => void;
  update: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  notice: string;
  clearNotice: () => void;
};
const CartContext = createContext<CartContextValue | null>(null);
function readCart(): CartItem[] {
  try {
    return parseCart(JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
  } catch {
    return [];
  }
}
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipPersist = useRef(false);
  useEffect(() => {
    const id = setTimeout(() => {
      setItems(readCart());
      setReady(true);
    }, 0);
    const sync = (event: StorageEvent) => {
      if (event.key === CART_KEY || event.key === null) {
        skipPersist.current = true;
        setItems(readCart());
      }
    };
    window.addEventListener("storage", sync);
    return () => {
      clearTimeout(id);
      window.removeEventListener("storage", sync);
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    try {
      localStorage.setItem(CART_KEY, JSON.stringify({ version: 2, items }));
    } catch {
      /* Continua disponível em memória. */
    }
  }, [items, ready]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const announce = useCallback((message: string) => {
    setNotice(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(""), 4000);
  }, []);
  const add = useCallback(
    (id: string, input?: Partial<ProductConfiguration>, quantity = 1) => {
      const product = products.find((p) => p.id === id);
      if (!product || !Number.isSafeInteger(quantity) || quantity < 1) return;
      const configuration = normalizeConfiguration(product, input);
      const key = configurationKey(id, configuration);
      const existing = items.find((item) => item.key === key);
      if (existing && existing.quantity >= MAX_QUANTITY) {
        announce("Esta combinação já atingiu o limite de 99 unidades.");
        return;
      }
      if (items.length >= 100 && !items.some((item) => item.key === key)) {
        announce(
          "O carrinho aceita até 100 combinações. Remova uma para continuar.",
        );
        return;
      }
      setItems((previous) => {
        const found = previous.find((i) => i.key === key);
        return found
          ? previous.map((i) =>
              i.key === key
                ? {
                    ...i,
                    quantity: Math.min(MAX_QUANTITY, i.quantity + quantity),
                  }
                : i,
            )
          : previous.length < 100
            ? [
                ...previous,
                {
                  key,
                  productId: id,
                  quantity: Math.min(MAX_QUANTITY, quantity),
                  configuration,
                },
              ]
            : previous;
      });
      announce(`${product.name} adicionado ao carrinho`);
    },
    [announce, items],
  );
  const remove = (key: string) => {
    setItems((previous) => previous.filter((i) => i.key !== key));
    announce("Item removido do carrinho");
  };
  const update = (key: string, quantity: number) => {
    if (!Number.isSafeInteger(quantity)) return;
    if (quantity < 1) remove(key);
    else
      setItems((previous) =>
        previous.map((i) =>
          i.key === key
            ? { ...i, quantity: Math.min(MAX_QUANTITY, quantity) }
            : i,
        ),
      );
  };
  const clear = () => {
    setItems([]);
    announce("Carrinho esvaziado");
  };
  return (
    <CartContext.Provider
      value={{
        items,
        ready,
        count: items.reduce((sum, i) => sum + i.quantity, 0),
        subtotalCents: cartSubtotalCents(items),
        add,
        update,
        remove,
        clear,
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
