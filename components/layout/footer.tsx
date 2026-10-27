import Link from "next/link";
import { ArrowUpRight, MapPin, Clock3 } from "lucide-react";
import { Logo } from "./header";
import { site } from "@/data/site";
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>
            Feito com paixão.
            <br />
            Servido com personalidade.
          </p>
          <span className="small-label">CURITIBA · DESDE 2020</span>
        </div>
        <div>
          <h3>Explore a cidade</h3>
          <Link href="/cardapio">
            Nosso cardápio <ArrowUpRight size={14} />
          </Link>
          <Link href="/delivery">Delivery</Link>
          <Link href="/checkout">Checkout demonstrativo</Link>
          <Link href="/reservas">Reserve sua mesa</Link>
          <Link href="/sobre">Nossa história</Link>
        </div>
        <div>
          <h3>Onde o sabor acontece</h3>
          <p>
            <MapPin size={17} />
            {site.address}
          </p>
          <span className="muted small">
            Endereço fictício para demonstração.
          </span>
          <Link href="/contato">
            Fale com a gente <ArrowUpRight size={14} />
          </Link>
        </div>
        <div>
          <h3>
            <Clock3 size={17} /> Horários da casa
          </h3>
          {site.hours.map((h) => (
            <p className="hours" key={h.days}>
              <span>{h.days}</span>
              <span>{h.time}</span>
            </p>
          ))}
          <span className="muted small">Horários demonstrativos.</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Cidade do Sabor. Feito para dar fome.
        </span>
        <span>Protótipo de demonstração · Sem pedidos ou reservas reais.</span>
      </div>
    </footer>
  );
}
