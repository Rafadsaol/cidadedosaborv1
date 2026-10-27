import Link from "next/link";
import { Flame, Heart, Leaf, Users, ArrowUpRight } from "lucide-react";
import { PageHeading, SectionHeading } from "@/components/ui/section-heading";
import { FoodImage } from "@/components/ui/food-image";
export const metadata = { title: "Sobre nós" };
export default function Page() {
  return (
    <>
      <PageHeading
        eyebrow="FEITO DE GENTE. FEITO COM PAIXÃO."
        title="Toda cidade tem uma boa história."
        description="A nossa começa com uma chapa quente, uma receita rabiscada e a vontade de fazer diferente."
      />
      <section className="container about-preview about-full">
        <div className="about-photo">
          <FoodImage
            src="/images/about.webp"
            alt="Hambúrguer artesanal, inspiração para a história da Cidade do Sabor"
          />
          <div className="photo-note">
            <Flame />
            <span>
              DESDE 2020<strong>Fome de fazer diferente.</strong>
            </span>
          </div>
        </div>
        <div className="about-copy">
          <SectionHeading
            eyebrow="NOSSA HISTÓRIA FICTÍCIA"
            title="Da primeira receita ao último detalhe."
          />
          <p>
            Na nossa história, tudo começou em 2020, entre amigos que
            acreditavam em uma ideia simples: comida boa tem o poder de
            aproximar pessoas.
          </p>
          <p>
            Foram muitas receitas, noites na cozinha e combinações improváveis
            até chegar ao primeiro Cidade Original. Um burger sem complicação,
            com ingredientes escolhidos a dedo e uma identidade impossível de
            confundir.
          </p>
          <p>
            Assim nasceu a Cidade do Sabor: um lugar imaginado para reunir a
            vizinhança, celebrar encontros e provar que o melhor ingrediente
            sempre vai ser o cuidado.
          </p>
          <span className="small muted">
            Marca, história e estabelecimento fictícios para portfólio.
          </span>
        </div>
      </section>
      <section className="container section">
        <SectionHeading
          eyebrow="O QUE MOVE A NOSSA CHAPA"
          title="Nossos ingredientes essenciais."
          centered
        />
        <div className="values-grid">
          {[
            {
              icon: Heart,
              title: "Paixão pelo que fazemos",
              text: "Cada receita nasce da vontade de criar momentos que dão gosto de lembrar.",
            },
            {
              icon: Leaf,
              title: "Qualidade sem atalhos",
              text: "Ingredientes selecionados, molhos artesanais e atenção aos pequenos detalhes.",
            },
            {
              icon: Users,
              title: "Gente em primeiro lugar",
              text: "Uma mesa acolhedora, boa companhia e espaço para todos os sabores.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article className="value-card" key={title}>
              <Icon size={30} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="centered section">
          <h2>Pronto para conhecer essa cidade?</h2>
          <Link href="/cardapio" className="button">
            Descubra seu favorito <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
