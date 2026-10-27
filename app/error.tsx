"use client";
import Link from "next/link";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="container empty-state">
      <h1>Opa, a chapa deu uma pausa.</h1>
      <p>Não conseguimos carregar esta página. Tente novamente.</p>
      <button className="button" onClick={reset}>
        Tentar novamente
      </button>
      <Link className="text-link" href="/">
        Voltar ao início
      </Link>
    </div>
  );
}
