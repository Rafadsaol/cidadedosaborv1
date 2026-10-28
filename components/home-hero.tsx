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
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const thumbnailNodes = useRef(new Map<string, HTMLButtonElement>());
  const previousPositions = useRef(new Map<string, number>());
  const animations = useRef<Animation[]>([]);
  const intro = useRef<HTMLDivElement>(null);
  const heroNodes = useRef(new Map<string, HTMLDivElement>());
  const previousHeroStyles = useRef(
    new Map<string, { opacity: string; transform: string }>(),
  );
  const motionDirection = useRef(1);
  const { add, ready } = useCart();
  const slide = slides[index];
  const product = products.find((p) => p.id === slide.id)!;
  const thumbnailOrder = [-1, 0, 1].map(
    (offset) => (index + offset + slides.length) % slides.length,
  );
  const select = (next: number) => {
    if (next === index) return;
    motionDirection.current =
      (next - index + slides.length) % slides.length === 1 ? 1 : -1;
    previousPositions.current = new Map(
      [...thumbnailNodes.current].map(([id, node]) => [
        id,
        node.getBoundingClientRect().left,
      ]),
    );
    previousHeroStyles.current = new Map(
      [...heroNodes.current].map(([id, node]) => {
        const style = window.getComputedStyle(node);
        return [id, { opacity: style.opacity, transform: style.transform }];
      }),
    );
    setIndex(next);
  };
  const change = (direction: number) =>
    select((index + direction + slides.length) % slides.length);
  useLayoutEffect(() => {
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
    if (!previousPositions.current.size) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const [id, node] of thumbnailNodes.current) {
        const before = previousPositions.current.get(id);
        if (before === undefined) continue;
        const distance = before - node.getBoundingClientRect().left;
        if (Math.abs(distance) < 1) continue;
        animations.current.push(
          node.animate(
            [
              { translate: `${distance}px 0`, offset: 0 },
              { translate: `${distance * 0.45}px -8px`, offset: 0.48 },
              { translate: "0px 0", offset: 1 },
            ],
            { duration: 740, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
          ),
        );
      }
      for (const [id, node] of heroNodes.current) {
        const before = previousHeroStyles.current.get(id);
        if (!before) continue;
        const selected = id === slides[index].id;
        if (!selected && Number(before.opacity) < 0.01) continue;
        const entry = `translateX(${motionDirection.current * 72}px) scale(0.94) rotate(${motionDirection.current * 3}deg)`;
        const exit = `translateX(${motionDirection.current * -64}px) scale(0.94) rotate(${motionDirection.current * -3}deg)`;
        animations.current.push(
          node.animate(
            [
              {
                opacity: before.opacity,
                transform: Number(before.opacity) > 0.01 ? before.transform : entry,
              },
              { opacity: selected ? 1 : 0, transform: selected ? "none" : exit },
            ],
            { duration: 780, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
          ),
        );
      }
      if (intro.current) {
        [...intro.current.children].forEach((element, position) => {
          animations.current.push(
            element.animate(
              [
                { opacity: 0, transform: "translateY(12px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              {
                duration: 520,
                delay: position * 75,
                easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
                fill: "backwards",
              },
            ),
          );
        });
      }
    }
    previousPositions.current.clear();
    previousHeroStyles.current.clear();
  }, [index]);
  useEffect(
    () => () => animations.current.forEach((animation) => animation.cancel()),
    [],
  );
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
          <div
            ref={intro}
            className="showcase-intro"
            aria-live="polite"
            aria-atomic="true"
          >
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
              <Plus size={17} /> Pedir agora{" "}
              <span>{money(product.priceCents)}</span>
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
                {thumbnailOrder.map((i) => {
                  const item = slides[i];
                  const p = products.find((p) => p.id === item.id)!;
                  return (
                    <button
                      key={item.id}
                      ref={(node) => {
                        if (node) thumbnailNodes.current.set(item.id, node);
                        else thumbnailNodes.current.delete(item.id);
                      }}
                      className={`burger-thumbnail ${i === index ? "is-selected" : ""}`}
                      onClick={() => select(i)}
                      aria-label={`Destacar ${p.name}`}
                      aria-pressed={i === index}
                    >
                      <span className="thumbnail-image">
                        <FoodImage
                          src={item.image}
                          alt=""
                          sizes="256px"
                          quality={90}
                          loading="eager"
                        />
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
                  onClick={() => select(i)}
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
          {slides.map((item, i) => (
            <div
              className={`showcase-food ${i === index ? "is-active" : ""}`}
              key={item.id}
              ref={(node) => {
                if (node) heroNodes.current.set(item.id, node);
                else heroNodes.current.delete(item.id);
              }}
              aria-hidden={i !== index}
            >
              <FoodImage
                src={item.image}
                alt={
                  i === 0
                    ? "Hambúrguer artesanal com pão, alface, tomate, cheddar e carnes em camadas suspensas"
                    : products.find((p) => p.id === item.id)!.name
                }
                sizes="(max-width: 640px) 85vw, (max-width: 900px) 45vw, 650px"
                quality={90}
                priority={i === 0}
                loading={i === 0 ? undefined : "eager"}
              />
            </div>
          ))}
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
