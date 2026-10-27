import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Flame,
  Bike,
  ChefHat,
  Leaf,
  Star,
  Quote,
  Check,
  UtensilsCrossed,
} from "lucide-react";
import { FoodImage } from "@/components/ui/food-image";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGrid } from "@/components/products/product-grid";
import { products } from "@/data/products";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-photo">
          <FoodImage
            src="/images/hero.webp"
            alt="Hambúrguer artesanal com cheddar derretido, bacon e pão brioche tostado"
            priority
          />
        </div>
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="eyebrow">
              <Flame size={15} /> ARTESANAL DE VERDADE. SABOR SEM LIMITES.
            </span>
            <h1>
              O sabor que
              <br />
              domina a <span>cidade.</span>
            </h1>
            <p>
              Fogo na chapa. Ingredientes de verdade.
              <br className="desktop-break" /> E um hambúrguer que você não vai
              esquecer.
            </p>
            <div className="hero-buttons">
              <Link href="/cardapio" className="button">
                Ver cardápio <ArrowUpRight size={19} />
              </Link>
              <Link href="/cardapio" className="button button-outline">
                <ShoppingIcon /> Pedir agora
              </Link>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack">
                <span>LM</span>
                <span>AC</span>
                <span>JP</span>
              </div>
              <div>
                <span className="stars">★★★★★</span>
                <p>
                  <strong>Feito para conquistar</strong> na primeira mordida.
                </p>
                <span className="small muted">
                  Conceito visual · avaliações demonstrativas
                </span>
              </div>
            </div>
          </div>
          <div className="hero-stamp">
            <Flame size={22} />
            <span>
              100%<small>ARTESANAL</small>
            </span>
          </div>
          <div className="hero-caption">
            <span>O ORIGINAL DA CASA</span>
            <strong>
              Cidade Original <span>↗</span>
            </strong>
          </div>
        </div>
        <div className="hero-bottom-line" />
      </section>
      <div className="benefits">
        <div className="container benefits-grid">
          {[
            {
              icon: ChefHat,
              title: "Artesanal de verdade",
              text: "Feito na hora, com paixão.",
            },
            {
              icon: Leaf,
              title: "Ingredientes selecionados",
              text: "Qualidade em cada mordida.",
            },
            {
              icon: Flame,
              title: "Sabor com personalidade",
              text: "Receitas que são a nossa cara.",
            },
            {
              icon: Bike,
              title: "Da nossa chapa pra você",
              text: "Conheça nosso delivery.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div className="benefit" key={title}>
              <Icon size={28} strokeWidth={1.5} />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <section className="section container">
        <div className="section-top">
          <SectionHeading
            eyebrow="OS FAVORITOS DA GALERA"
            title="Difícil escolher. Fácil se apaixonar."
            description="Os queridinhos da casa, feitos para virar o seu próximo favorito."
          />
          <Link className="text-link" href="/cardapio">
            Explorar cardápio <ArrowRight size={17} />
          </Link>
        </div>
        <ProductGrid products={products.slice(0, 4)} />
      </section>
      <section className="container">
        <div className="combo-banner">
          <div className="combo-copy">
            <span className="eyebrow">FOME GRANDE. COMBO COMPLETO.</span>
            <h2>
              Um combo.
              <br />
              <span>Todos os motivos.</span>
            </h2>
            <p>
              Cidade Original + fritas crocantes + refrigerante.
              <br />O trio que nasceu para estar junto.
            </p>
            <div className="combo-price">
              <span>
                A combinação perfeita por<strong>R$ 44,90</strong>
              </span>
              <Link href="/cardapio" className="button">
                Quero esse combo <ArrowUpRight size={18} />
              </Link>
            </div>
            <span className="small muted">Oferta e preço demonstrativos.</span>
          </div>
          <div className="combo-photo">
            <FoodImage
              src="/images/combo.webp"
              alt="Combo ilustrativo de hambúrguer artesanal com batatas"
            />
            <span className="round-label">
              BOM DEMAIS
              <br />
              PRA DEIXAR
              <br />
              <strong>PASSAR.</strong>
            </span>
          </div>
        </div>
      </section>
      <section className="section container about-preview">
        <div className="about-photo">
          <FoodImage
            src="/images/about.webp"
            alt="Hambúrguer preparado artesanalmente com ingredientes selecionados"
          />
          <div className="photo-note">
            <Flame size={22} />
            <span>
              MAIS QUE UM BURGER.<strong>Uma experiência.</strong>
            </span>
          </div>
        </div>
        <div className="about-copy">
          <SectionHeading
            eyebrow="PRAZER, CIDADE DO SABOR"
            title="Nascemos da fome de fazer diferente."
          />
          <p>
            Acreditamos que um bom hambúrguer vai muito além da receita. É sobre
            reunir pessoas, criar memórias e transformar uma simples mordida em
            um baita momento.
          </p>
          <p>
            Da escolha do pão ao último toque de molho, cada detalhe tem um
            motivo: fazer você querer voltar.
          </p>
          <div className="check-list">
            <span>
              <Check size={17} /> Blend exclusivo da casa
            </span>
            <span>
              <Check size={17} /> Molhos feitos por aqui
            </span>
            <span>
              <Check size={17} /> Paixão em cada detalhe
            </span>
          </div>
          <Link href="/sobre" className="text-link">
            Conheça nossa história <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <section className="reviews-section">
        <div className="container">
          <SectionHeading
            eyebrow="QUEM PROVA, TEM HISTÓRIA PRA CONTAR"
            title="Sabor que rende bons comentários."
            description="Depoimentos fictícios, criados para demonstrar a experiência da marca."
            centered
          />
          <div className="review-grid">
            {[
              {
                name: "Luiza Martins",
                initials: "LM",
                quote:
                  "Pão macio, carne no ponto e aquele molho que dá vontade de colocar em tudo. O Cidade Original ganhou meu coração.",
                order: "Time Cidade Original",
              },
              {
                name: "André Costa",
                initials: "AC",
                quote:
                  "O Bacon Boulevard é absurdo! Dá pra sentir o cuidado em cada ingrediente. Já virou meu combo de sexta-feira.",
                order: "Time Bacon Boulevard",
              },
              {
                name: "Júlia Pereira",
                initials: "JP",
                quote:
                  "Finalmente uma opção veggie com personalidade. Sabor de verdade e uma combinação que surpreende!",
                order: "Time Jardim Veggie",
              },
            ].map((r) => (
              <article className="review-card" key={r.name}>
                <div className="review-top">
                  <span className="stars">
                    <Star size={14} fill="currentColor" />
                    ★★★★★
                  </span>
                  <Quote size={27} />
                </div>
                <p>“{r.quote}”</p>
                <div className="review-person">
                  <span className="avatar">{r.initials}</span>
                  <span>
                    <strong>{r.name}</strong>
                    <small>{r.order} · Demonstração</small>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="container section">
        <div className="delivery-banner">
          <div className="delivery-symbol">
            <Bike size={55} strokeWidth={1.3} />
          </div>
          <div>
            <span className="eyebrow">SEU PRÓXIMO MOMENTO FAVORITO</span>
            <h2>
              A cidade tem sabor.
              <br />E ele pode chegar até você.
            </h2>
            <p>Conheça a proposta do nosso delivery e monte seu carrinho.</p>
          </div>
          <Link href="/delivery" className="button button-light">
            Conhecer o delivery <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
function ShoppingIcon() {
  return <UtensilsCrossed size={18} />;
}
