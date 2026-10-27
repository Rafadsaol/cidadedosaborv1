import Link from "next/link";
import { Flame } from "lucide-react";
export default function NotFound() {
  return (
    <div className="container empty-state">
      <Flame size={48} />
      <span className="eyebrow">404 · FORA DO MAPA</span>
      <h1>Esse endereço não está no cardápio.</h1>
      <p>Mas temos um monte de coisa boa esperando por você.</p>
      <Link href="/" className="button">
        Voltar para o início
      </Link>
    </div>
  );
}
