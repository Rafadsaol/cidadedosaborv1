"use client";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Flame,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { FoodImage } from "@/components/ui/food-image";
import { useCart } from "@/components/cart-provider";
import { money } from "@/lib/utils";
import { products } from "@/data/products";
const slides = [
  {
    id: "duplo",
    image: "/images/exploded-burger.png",
    label: "CAMADAS DE PURO SABOR",
    title: (
      <>
        O sabor que
        <br />
        domina a <em>cidade.</em>
      </>
    ),
    description:
      "Pão dourado, carne na brasa e camadas de personalidade. Uma experiência artesanal, da primeira à última mordida.",
  },
  {
    id: "bacon",
    image: "/images/bacon-cutout.png",
    label: "CROCÂNCIA EM OUTRO NÍVEL",
    title: (
      <>
        Bacon de sobra.
        <br />
        <em>Sabor sem limites.</em>
      </>
    ),
    description:
      "Bacon crocante, cheddar derretido e cebola caramelizada. O encontro perfeito para quem não abre mão de intensidade.",
  },
  {
    id: "veggie",
    image: "/images/veggie-cutout.png",
    label: "VERDE. AUTÊNTICO. SURPREENDENTE.",
    title: (
      <>
        Feito de plantas.
        <br />
        <em>Cheio de atitude.</em>
      </>
    ),
    description:
      "Grão-de-bico, vegetais frescos e molho de ervas. Nosso jeito de provar que um grande burger vai muito além da carne.",
  },
];
export function HomeHero() {
  const [index, setIndex] = useState(0);
  const { add, ready } = useCart();
  const slide = slides[index];
  const product = products.find((p) => p.id === slide.id)!;
  const change = (direction: number) =>
    setIndex((value) => (value + direction + slides.length) % slides.length);
  return (
    <section
      className="showcase"
      aria-label="Destaques da Cidade do Sabor"
      aria-roledescription="carrossel"
    >
      <div className="showcase-grid">
        <div className="showcase-copy">
          <span className="showcase-kicker">
            <span /> ARTESANAL DE VERDADE
          </span>
          <div className="showcase-intro" aria-live="polite" aria-atomic="true">
            <span className="showcase-edition">{slide.label}</span>
            <h1>{slide.title}</h1>
            <p>{slide.description}</p>
          </div>
          <div className="showcase-buttons">
            <button
              className="button showcase-order"
              disabled={!ready}
              onClick={() => add(product.id)}
            >
              <Plus size={17} /> Pedir agora <span>{money(product.price)}</span>
            </button>
            <Link href="/cardapio" className="showcase-menu-link">
              Ver cardápio <ArrowUpRight size={17} />
            </Link>
          </div>
          <p className="showcase-disclaimer">
            Monte seu carrinho · Sem envio de pedidos reais.
          </p>
          <div className="burger-selector">
            <span className="selector-label">ESCOLHA SEU PRÓXIMO FAVORITO</span>
            <div className="selector-row">
              <button
                className="selector-arrow"
                onClick={() => change(-1)}
                aria-label="Hambúrguer anterior"
              >
                <ArrowLeft size={19} />
              </button>
              <div className="burger-thumbnails">
                {slides.map((item, i) => {
                  const p = products.find((p) => p.id === item.id)!;
                  return (
                    <button
                      key={item.id}
                      className={`burger-thumbnail ${i === index ? "is-selected" : ""}`}
                      onClick={() => setIndex(i)}
                      aria-label={`Destacar ${p.name}`}
                      aria-pressed={i === index}
                    >
                      <span className="thumbnail-image">
                        <FoodImage src={item.image} alt="" sizes="100px" />
                      </span>
                      <span className="thumbnail-name">{p.name}</span>
                    </button>
                  );
                })}
              </div>
              <button
                className="selector-arrow"
                onClick={() => change(1)}
                aria-label="Próximo hambúrguer"
              >
                <ArrowRight size={19} />
              </button>
            </div>
            <div className="slider-dots" aria-label="Selecionar destaque">
              {slides.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => setIndex(i)}
                  className={i === index ? "is-selected" : ""}
                  aria-label={`Destaque ${i + 1}`}
                  aria-pressed={i === index}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="showcase-visual">
          <span className="showcase-orbit" aria-hidden="true" />
          <span className="vertical-note">
            BLEND EXCLUSIVO · FEITO NA HORA · 100% ARTESANAL
          </span>
          <div className="showcase-food" key={slide.id}>
            <FoodImage
              src={slide.image}
              alt={
                index === 0
                  ? "Hambúrguer artesanal com pão, alface, tomate, cheddar e carnes em camadas suspensas"
                  : product.name
              }
              sizes="(max-width: 640px) 85vw, (max-width: 900px) 45vw, 650px"
              priority
            />
          </div>
          <span className="showcase-seal">
            <Flame size={18} />
            <span>
              FEITO COM<strong>PERSONALIDADE.</strong>
            </span>
          </span>
          <span className="showcase-product-name">
            {product.name}
            <small>Imagem ilustrativa</small>
          </span>
        </div>
      </div>
      <div className="showcase-bottom">
        <span>BOA COMIDA. BONS ENCONTROS.</span>
        <a href="#favoritos" className="showcase-scroll">
          Explore os sabores <ArrowDown size={15} />
        </a>
        <span className="showcase-counter">
          0{index + 1} <span>/ 03</span>
        </span>
      </div>
    </section>
  );
}
