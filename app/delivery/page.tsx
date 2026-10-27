import Link from "next/link";
import {
  Bike,
  ShoppingBag,
  ArrowUpRight,
  PackageCheck,
  Flame,
  UtensilsCrossed,
} from "lucide-react";
import { PageHeading, SectionHeading } from "@/components/ui/section-heading";
import { FoodImage } from "@/components/ui/food-image";
export const metadata = { title: "Delivery" };
export default function Page() {
  return (
    <>
      <PageHeading
        eyebrow="DA NOSSA CHAPA PRA VOCÊ"
        title="Seu lugar favorito. Nosso sabor."
        description="Sofá, mesa de trabalho ou encontro com a galera. Tem sempre um momento que combina com um bom burger."
      />
      <section className="container delivery-intro">
        <div className="delivery-photo">
          <FoodImage
            src="/images/combo.webp"
            alt="Hambúrguer artesanal e batatas, ilustrando a proposta de delivery"
          />
          <span className="image-badge">
            <Bike size={22} /> Sabor que vai com você.
          </span>
        </div>
        <div>
          <SectionHeading
            eyebrow="CONHEÇA A PROPOSTA"
            title="O mesmo cuidado. Um novo endereço."
          />
          <p className="muted">
            Nossa ideia é levar a experiência da Cidade do Sabor até a sua mesa,
            com ingredientes selecionados e muito capricho em cada detalhe.
          </p>
          <div className="check-list">
            <span>
              <Flame size={18} /> Feito na hora, com personalidade
            </span>
            <span>
              <PackageCheck size={18} /> Embalagens pensadas para o seu burger
            </span>
            <span>
              <UtensilsCrossed size={18} /> Combos para todos os momentos
            </span>
          </div>
          <Link className="button" href="/cardapio">
            Explorar cardápio <ArrowUpRight size={18} />
          </Link>
          <div className="info-box">
            Delivery demonstrativo: não há consulta de área atendida, prazo,
            frete, disponibilidade ou rastreamento. Nenhum pedido é enviado.
          </div>
        </div>
      </section>
      <section className="container section">
        <SectionHeading
          eyebrow="EXPERIMENTE NO NAVEGADOR"
          title="Monte sua combinação favorita."
          centered
        />
        <div className="steps-grid">
          {[
            {
              n: "01",
              title: "Explore os sabores",
              text: "Busque seu burger ou descubra um novo favorito no cardápio.",
            },
            {
              n: "02",
              title: "Monte seu carrinho",
              text: "Adicione produtos e ajuste as quantidades do seu jeito.",
            },
            {
              n: "03",
              title: "Confira sua seleção",
              text: "Veja o subtotal local. A experiência termina na simulação.",
            },
          ].map((s) => (
            <div className="step-card" key={s.n}>
              <span>{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
        <div className="centered">
          <Link href="/carrinho" className="button button-outline">
            <ShoppingBag size={18} /> Ir para meu carrinho
          </Link>
        </div>
      </section>
    </>
  );
}
