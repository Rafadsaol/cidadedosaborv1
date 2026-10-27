import Link from "next/link";
import { Flame, ArrowLeft } from "lucide-react";
import { FoodImage } from "./ui/food-image";
import { DemoForm } from "./demo-form";
export function AuthPage({ register = false }: { register?: boolean }) {
  return (
    <section className="container auth-layout">
      <div className="auth-photo">
        <FoodImage
          src="/images/hero.webp"
          alt="Hambúrguer da Cidade do Sabor"
          priority
        />
        <div>
          <Flame size={35} />
          <h2>
            Bom ter você
            <br />
            por aqui.
          </h2>
          <p>
            A próxima história da cidade
            <br />
            pode começar com você.
          </p>
        </div>
      </div>
      <div className="auth-panel">
        <Link className="text-link small" href="/">
          <ArrowLeft size={16} /> Voltar ao início
        </Link>
        <span className="eyebrow">ÁREA DO CLIENTE · DEMONSTRAÇÃO</span>
        <h1>{register ? "Entre para a cidade." : "A casa também é sua."}</h1>
        <p className="muted">
          {register
            ? "Conheça a interface de cadastro da Cidade do Sabor."
            : "Explore a interface de acesso da Cidade do Sabor."}
        </p>
        <DemoForm kind={register ? "register" : "login"} />
      </div>
    </section>
  );
}
