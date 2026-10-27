"use client";
import { Minus, Plus } from "lucide-react";
import { MAX_QUANTITY } from "@/lib/cart";
export function QuantityControl({
  name,
  value,
  onChange,
  allowRemove = false,
}: {
  name: string;
  value: number;
  onChange: (quantity: number) => void;
  allowRemove?: boolean;
}) {
  return (
    <div className="quantity-control">
      <button
        type="button"
        className="icon-button"
        disabled={!allowRemove && value <= 1}
        aria-label={`Diminuir quantidade de ${name}`}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={16} />
      </button>
      <span aria-label={`Quantidade de ${name}`}>{value}</span>
      <button
        type="button"
        className="icon-button"
        disabled={value >= MAX_QUANTITY}
        aria-label={`Aumentar quantidade de ${name}`}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
