"use client";
import { useEffect, useRef } from "react";
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!open || !dialog.current) return;
    const element = dialog.current;
    element.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previous;
    };
  }, [open]);
  return (
    <dialog
      className="confirm-dialog"
      ref={dialog}
      onCancel={onClose}
      aria-labelledby="clear-cart-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <h2 id="clear-cart-title">Esvaziar seu carrinho?</h2>
      <p>
        Todos os produtos e personalizações serão removidos deste navegador.
      </p>
      <div className="confirm-actions">
        <button
          type="button"
          className="button button-outline"
          autoFocus
          onClick={onClose}
        >
          Manter carrinho
        </button>
        <button
          type="button"
          className="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Sim, esvaziar
        </button>
      </div>
    </dialog>
  );
}
