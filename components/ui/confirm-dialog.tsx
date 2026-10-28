"use client";
import { useEffect, useId, useRef } from "react";
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Esvaziar seu carrinho?",
  description = "Todos os produtos e personalizações serão removidos deste navegador.",
  confirmLabel = "Sim, esvaziar",
  cancelLabel = "Manter carrinho",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  const titleId = useId();
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
      aria-labelledby={titleId}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <h2 id={titleId}>{title}</h2>
      <p>{description}</p>
      <div className="confirm-actions">
        <button
          type="button"
          className="button button-outline"
          autoFocus
          onClick={onClose}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
