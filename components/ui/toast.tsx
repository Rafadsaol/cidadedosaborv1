"use client";
import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
export function Toast() {
  const { notice, clearNotice } = useCart();
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {notice && (
        <div className="toast">
          <CheckCircle2 size={21} />
          <span>
            {notice}
            <Link href="/carrinho">Ver carrinho →</Link>
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
