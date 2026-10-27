import { CalendarDays, Users, UtensilsCrossed } from "lucide-react";
import { PageHeading } from "@/components/ui/section-heading";
import { DemoForm } from "@/components/demo-form";
export const metadata = { title: "Reservas" };
export default function Page() {
  return (
    <>
      <PageHeading
        eyebrow="TEM LUGAR PRA VOCÊ"
        title="Bons momentos começam à mesa."
        description="Um encontro com a galera, um jantar a dois ou um motivo qualquer para celebrar. Imagine sua próxima visita."
      />
      <section className="container split-page">
        <div className="story-side">
          <div className="feature-icon">
            <CalendarDays size={32} />
          </div>
          <h2>
            Sua mesa.
            <br />
            Seu momento.
          </h2>
          <p>
            Um espaço pensado para desacelerar, compartilhar histórias e comer
            um hambúrguer de respeito.
          </p>
          <div className="mini-feature">
            <Users />
            <div>
              <h3>Boa companhia é ingrediente</h3>
              <p>Simule uma mesa para até 8 pessoas.</p>
            </div>
          </div>
          <div className="mini-feature">
            <UtensilsCrossed />
            <div>
              <h3>Experiência completa</h3>
              <p>Da primeira mordida ao último papo.</p>
            </div>
          </div>
          <div className="info-box">
            Este protótipo não consulta disponibilidade e não realiza reservas.
            Os horários são apenas exemplos.
          </div>
        </div>
        <div className="form-panel">
          <h2>Planeje sua visita</h2>
          <p className="muted">
            Preencha os dados para experimentar o formulário.
          </p>
          <DemoForm kind="reservation" />
        </div>
      </section>
    </>
  );
}
