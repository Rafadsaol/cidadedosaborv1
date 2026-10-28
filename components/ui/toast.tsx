"use client";
import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { useCart } from "@/components/cart-provider";
export function Toast() {
  const cart = useCart();
  const demo = useDemo();
  const notice = demo.notice || cart.notice;
  const clearNotice = () => { demo.clearNotice(); cart.clearNotice(); };
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {notice && (
        <div className="toast">
          <CheckCircle2 size={21} />
          <span>
            {notice}
            {!demo.notice && <Link href="/carrinho">Ver carrinho →</Link>}
          </span>
          <button
            className="icon-button"
            onClick={clearNotice}
            aria-label="Fechar aviso"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
