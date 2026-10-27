import { MapPin, Phone, Clock3, MessageCircle, Instagram } from "lucide-react";
import { PageHeading } from "@/components/ui/section-heading";
import { DemoForm } from "@/components/demo-form";
import { site } from "@/data/site";
export const metadata = { title: "Contato" };
export default function Page() {
  return (
    <>
      <PageHeading
        eyebrow="VAMOS CONVERSAR?"
        title="A gente gosta de uma boa conversa."
        description="Dúvidas, ideias ou só aquela vontade de falar sobre hambúrguer. Esse espaço é seu."
      />
      <section className="container split-page">
        <div className="contact-details">
          <div className="contact-block">
            <MapPin />
            <div>
              <h2>Nosso ponto de encontro</h2>
              <p>{site.address}</p>
              <span className="small muted">
                Endereço fictício. Não há uma loja neste local.
              </span>
            </div>
          </div>
          <div className="contact-block">
            <Phone />
            <div>
              <h2>Alô, Cidade do Sabor!</h2>
              <p>{site.phone}</p>
              <span className="small muted">
                Telefone fictício, sem atendimento.
              </span>
            </div>
          </div>
          <div className="contact-block">
            <Clock3 />
            <div>
              <h2>Horários da casa</h2>
              {site.hours.map((h) => (
                <p className="hours" key={h.days}>
                  <span>{h.days}</span>
                  <span>{h.time}</span>
                </p>
              ))}
              <span className="small muted">Horários demonstrativos.</span>
            </div>
          </div>
          {site.whatsapp && /^https:\/\/wa\.me\/\d+$/.test(site.whatsapp) ? (
            <a
              className="button"
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} /> Conversar no WhatsApp
            </a>
          ) : (
            <div className="disabled-channel">
              <MessageCircle size={20} />
              <span>
                WhatsApp ainda não configurado
                <small>Nenhum contato real nesta demonstração.</small>
              </span>
            </div>
          )}
          {site.instagram &&
          /^https:\/\/www\.instagram\.com\//.test(site.instagram) ? (
            <a
              className="text-link"
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={18} /> Instagram
            </a>
          ) : (
            <p className="social-demo">
              <Instagram size={18} /> @cidadedosabor · perfil ilustrativo, sem
              link
            </p>
          )}
        </div>
        <div className="form-panel">
          <h2>Deixe seu recado</h2>
          <p className="muted">Aqui a conversa é só uma simulação.</p>
          <DemoForm kind="contact" />
        </div>
      </section>
    </>
  );
}
