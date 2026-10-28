"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { DEMO_KEY, createOrder, initialDemo, localId, parseDemo, updateOrderStatus, validProduct, validateReservation, customerId } from "@/lib/demo";
import { products as initialProducts } from "@/data/products";
import type { CartItem, CheckoutData, Product } from "@/types";
import type { DemoRole, DemoState, DemoOrder, DemoReservation, OrderStatus } from "@/types/demo";
type ReservationInput = Pick<DemoReservation, "name" | "phone" | "date" | "time" | "people" | "notes">;
type DemoContextValue = DemoState & {
  ready: boolean;
  persistent: boolean;
  notice: string;
  clearNotice: () => void;
  notify: (message: string) => void;
  login: (profile: DemoRole | null) => void;
  placeOrder: (items: CartItem[], data: CheckoutData) => DemoOrder | null;
  changeStatus: (id: string, status: OrderStatus) => void;
  saveProduct: (product: Product) => boolean;
  deleteProduct: (id: string) => void;
  restoreProducts: () => void;
  reserve: (input: ReservationInput) => string;
  changeReservation: (id: string, status: DemoReservation["status"]) => void;
  restoreAll: () => void;
};
const Context = createContext<DemoContextValue | null>(null);
const shell: DemoState = {
  version: 3,
  profile: null,
  products: initialProducts,
  orders: [],
  reservations: []
};
export function DemoProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<DemoState>(shell);
  const current = useRef(state);
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);
  const [persistent, setPersistent] = useState(true);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notify = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 5500);
  }, []);
  const persist = useCallback((next: DemoState) => {
    try {
      localStorage.setItem(DEMO_KEY, JSON.stringify(next));
      setPersistent(true);
    } catch {
      setPersistent(false);
    }
  }, []);
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem(DEMO_KEY);
        const parsed = raw ? parseDemo(JSON.parse(raw)) : null;
        if (raw && !parsed) notify("Dados inválidos recuperados. Os exemplos da demonstração foram restaurados.");
        return parsed || initialDemo();
      } catch {
        notify("Não foi possível ler os dados locais. A demonstração continua disponível.");
        return initialDemo();
      }
    };
    const timer = setTimeout(() => {
      const next = read();
      current.current = next;
      initialized.current = true;
      setState(next);
      setReady(true);
      persist(next);
    }, 0);
    const sync = (event: StorageEvent) => {
      if (event.key !== DEMO_KEY && event.key !== null) return;
      const next = read();
      current.current = next;
      setState(next);
    };
    window.addEventListener("storage", sync);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("storage", sync);
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    };
  }, [notify, persist]);
  const commit = (updater: (previous: DemoState) => DemoState) => {
    if (!initialized.current) return;
    const next = updater(current.current);
    current.current = next;
    setState(next);
    persist(next);
  };
  const admin = () => current.current.profile === "admin";
  const value: DemoContextValue = {
    ...state,
    ready,
    persistent,
    notice,
    clearNotice: () => setNotice(""),
    notify,
    login: profile => {
      commit(s => ({
        ...s,
        profile
      }));
      notify(profile === "admin" ? "Perfil Administrador Demo ativado" : profile === "customer" ? "Olá, Cliente Teste! Perfil demonstrativo ativado" : "Perfil demonstrativo encerrado");
    },
    placeOrder: (items, data) => {
      if (!initialized.current || current.current.orders.length >= 500) {
        notify("Limite de 500 pedidos locais atingido. Restaure a demonstração nas configurações.");
        return null;
      }
      const order = createOrder(items, current.current.products, data);
      if (!order) {
        notify("Revise o carrinho: algum produto pode ter sido alterado ou estar indisponível.");
        return null;
      }
      commit(s => ({
        ...s,
        orders: [order, ...s.orders]
      }));
      notify(`Pedido de teste ${order.number} recebido. Nenhum pedido real foi enviado.`);
      return order;
    },
    changeStatus: (id, status) => {
      if (!admin()) return;
      commit(s => ({
        ...s,
        orders: s.orders.map(o => o.id === id ? updateOrderStatus(o, status) : o)
      }));
      notify("Status do pedido local atualizado");
    },
    saveProduct: product => {
      if (!admin() || !validProduct(product) || !current.current.products.some(p => p.id === product.id) && current.current.products.length >= 200) return false;
      commit(s => ({
        ...s,
        products: s.products.some(p => p.id === product.id) ? s.products.map(p => p.id === product.id ? product : p) : [...s.products, product]
      }));
      notify("Produto salvo no cardápio deste navegador");
      return true;
    },
    deleteProduct: id => {
      if (!admin()) return;
      commit(s => ({
        ...s,
        products: s.products.filter(p => p.id !== id)
      }));
      notify("Produto excluído do cardápio local. Pedidos anteriores foram preservados.");
    },
    restoreProducts: () => {
      if (!admin()) return;
      commit(s => ({
        ...s,
        products: structuredClone(initialProducts)
      }));
      notify("Cardápio demonstrativo restaurado");
    },
    reserve: input => {
      const error = validateReservation(input);
      if (error) return error;
      if (!initialized.current || current.current.reservations.length >= 500) return "Limite de 500 reservas locais atingido. Restaure a demonstração nas configurações.";
      const reservation: DemoReservation = {
        ...input,
        name: input.name.trim(),
        phone: input.phone.trim(),
        id: localId("reservation"),
        customerId,
        createdAt: new Date().toISOString(),
        status: "Pendente",
        sample: false
      };
      commit(s => ({
        ...s,
        reservations: [reservation, ...s.reservations]
      }));
      notify("Reserva de teste registrada apenas neste navegador");
      return "";
    },
    changeReservation: (id, status) => {
      if (!admin()) return;
      commit(s => ({
        ...s,
        reservations: s.reservations.map(r => r.id === id && r.status !== "Cancelada" ? {
          ...r,
          status
        } : r)
      }));
      notify("Reserva demonstrativa atualizada");
    },
    restoreAll: () => {
      if (!admin()) return;
      commit(() => ({
        ...initialDemo(),
        profile: "admin"
      }));
      notify("Dados V3 restaurados. O carrinho foi mantido.");
    }
  };
  return <Context.Provider value={value}>{children}{!persistent && <div className="storage-warning" role="status">Armazenamento indisponível ou cheio. As alterações ficam apenas nesta aba e serão perdidas ao recarregar.</div>}</Context.Provider>;
}
export function useDemo() {
  const value = useContext(Context);
  if (!value) throw new Error("DemoProvider ausente");
  return value;
}
