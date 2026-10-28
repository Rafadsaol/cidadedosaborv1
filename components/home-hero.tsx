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
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
type CarouselMotion = { from: number; to: number; direction: number };
const wrap = (value: number) => (value + slides.length) % slides.length;
const MOTION_PREFERENCE_KEY = "cidade-do-sabor:showcase-full-motion";
export function HomeHero() {
  const [index, setIndex] = useState(0);
  const [motion, setMotion] = useState<CarouselMotion | null>(null);
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
  const [fullMotionEnabled, setFullMotionEnabled] = useState(false);
  const fullMotionOverride = useRef(false);
  const settledIndex = useRef(0);
  const desiredIndex = useRef(0);
  const currentMotion = useRef<CarouselMotion | null>(null);
  const queuedFrame = useRef<number | null>(null);
  const restoreTrackFocus = useRef(false);
  const track = useRef<HTMLDivElement>(null);
  const animations = useRef<Animation[]>([]);
  const intro = useRef<HTMLDivElement>(null);
  const heroNodes = useRef(new Map<string, HTMLDivElement>());
  const previousHeroStyles = useRef(
    new Map<string, { opacity: string; transform: string }>(),
  );
  const motionDirection = useRef(1);
  const { add, ready } = useCart();
  const activeIndex = motion?.to ?? index;
  const slide = slides[activeIndex];
  const product = products.find((p) => p.id === slide.id)!;
  const thumbnailOrder = [-2, -1, 0, 1, 2].map((offset) => wrap(index + offset));
  const selectedSlot = motion ? 2 + motion.direction : 2;
  const firstVisibleSlot = motion ? 1 + motion.direction : 1;
  const reducedMotion = systemReducedMotion && !fullMotionEnabled;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const synchronize = () => setSystemReducedMotion(preference.matches);
    const timer = setTimeout(() => {
      synchronize();
      try {
        const enabled = sessionStorage.getItem(MOTION_PREFERENCE_KEY) === "true";
        fullMotionOverride.current = enabled;
        setFullMotionEnabled(enabled);
      } catch { /* A escolha continua disponível nesta página. */ }
    }, 0);
    preference.addEventListener("change", synchronize);
    return () => {
      clearTimeout(timer);
      preference.removeEventListener("change", synchronize);
    };
  }, []);

  const toggleFullMotion = () => {
    const enabled = !fullMotionOverride.current;
    fullMotionOverride.current = enabled;
    setFullMotionEnabled(enabled);
    try { sessionStorage.setItem(MOTION_PREFERENCE_KEY, String(enabled)); } catch { /* Sem persistência. */ }
    if (!enabled) {
      animations.current.forEach((animation) => animation.cancel());
      if (queuedFrame.current !== null) cancelAnimationFrame(queuedFrame.current);
      currentMotion.current = null;
      settledIndex.current = desiredIndex.current;
      setMotion(null);
      setIndex(desiredIndex.current);
    }
  };

  const beginStep = useCallback((from: number, to: number) => {
    if (from === to) return;
    const nextMotion = { from, to, direction: wrap(to - from) === 1 ? 1 : -1 };
    motionDirection.current = nextMotion.direction;
    previousHeroStyles.current = new Map(
      [...heroNodes.current].map(([id, node]) => {
        const style = window.getComputedStyle(node);
        return [id, { opacity: style.opacity, transform: style.transform }];
      }),
    );
    currentMotion.current = nextMotion;
    setMotion(nextMotion);
  }, []);
  const finishStep = useCallback(
    (expected: CarouselMotion) => {
      if (currentMotion.current !== expected) return;
      restoreTrackFocus.current = !!track.current?.contains(document.activeElement);
      settledIndex.current = expected.to;
      currentMotion.current = null;
      setIndex(expected.to);
      setMotion(null);
      if (desiredIndex.current !== expected.to) {
        queuedFrame.current = requestAnimationFrame(() => {
          queuedFrame.current = requestAnimationFrame(() => {
            queuedFrame.current = null;
            if (!currentMotion.current) {
              beginStep(settledIndex.current, desiredIndex.current);
            }
          });
        });
      }
    },
    [beginStep],
  );
  const select = (next: number) => {
    desiredIndex.current = next;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && !fullMotionOverride.current) {
      restoreTrackFocus.current = !!track.current?.contains(document.activeElement);
      currentMotion.current = null;
      settledIndex.current = next;
      setMotion(null);
      setIndex(next);
      return;
    }
    if (!currentMotion.current) beginStep(settledIndex.current, next);
  };
  const change = (direction: number) =>
    select(wrap(desiredIndex.current + direction));

  useLayoutEffect(() => {
    if (!motion || !track.current) return;
    const element = track.current;
    const card = element.firstElementChild as HTMLElement | null;
    if (!card) return;
    const step =
      card.getBoundingClientRect().width +
      parseFloat(getComputedStyle(element).columnGap);
    const animation = element.animate(
      [
        { transform: `translateX(${-step}px)` },
        { transform: `translateX(${-step * (1 + motion.direction)}px)` },
      ],
      {
        duration: 950,
        easing: "cubic-bezier(0.35, 0, 0.2, 1)",
        fill: "forwards",
      },
    );
    animation.onfinish = () => finishStep(motion);
    return () => {
      animation.onfinish = null;
      animation.cancel();
    };
  }, [motion, finishStep]);

  useLayoutEffect(() => {
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
    if (!previousHeroStyles.current.size) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches || fullMotionOverride.current) {
      for (const [id, node] of heroNodes.current) {
        const before = previousHeroStyles.current.get(id);
        if (!before) continue;
        const selected = id === slides[activeIndex].id;
        if (!selected && Number(before.opacity) < 0.01) continue;
        const entry = `translateX(${motionDirection.current * 144}px) scale(0.93) rotate(${motionDirection.current * 3}deg)`;
        const exit = `translateX(${motionDirection.current * -120}px) scale(0.93) rotate(${motionDirection.current * -3}deg)`;
        animations.current.push(
          node.animate(
            [
              { opacity: before.opacity, transform: Number(before.opacity) > 0.01 ? before.transform : entry },
              { opacity: selected ? 1 : 0, transform: selected ? "none" : exit },
            ],
            { duration: 900, easing: "cubic-bezier(0.35, 0, 0.2, 1)" },
          ),
        );
      }
      if (intro.current) {
        [...intro.current.children].forEach((element, position) => {
          animations.current.push(
            element.animate(
              [
                { opacity: 0, transform: "translateY(16px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              { duration: 620, delay: position * 85, easing: "ease-out", fill: "backwards" },
            ),
          );
        });
      }
    }
    previousHeroStyles.current.clear();
  }, [activeIndex]);
  useLayoutEffect(() => {
    const focused = document.activeElement;
    if (
      !motion && track.current &&
      (restoreTrackFocus.current || track.current.contains(focused))
    ) {
      track.current
        .querySelector<HTMLButtonElement>('[aria-pressed="true"]')
        ?.focus({ preventScroll: true });
      restoreTrackFocus.current = false;
    }
  }, [index, motion]);
  useEffect(
    () => () => {
      animations.current.forEach((animation) => animation.cancel());
      if (queuedFrame.current !== null) cancelAnimationFrame(queuedFrame.current);
    },
    [],
  );
  return (
    <section
      className="showcase"
      aria-label="Destaques da Cidade do Sabor"
      aria-roledescription="carrossel"
      data-full-motion={fullMotionEnabled ? "true" : undefined}
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
            {systemReducedMotion && (
              <div className="selector-motion-control">
                <span role="status">{reducedMotion ? "Movimento reduzido no dispositivo" : "Animação completa ativada"}</span>
                <button type="button" aria-pressed={fullMotionEnabled} onClick={toggleFullMotion}>
                  {fullMotionEnabled ? "Reduzir movimento" : "Ativar animação"}
                </button>
              </div>
            )}
            <div className="selector-row">
              <button
                className="selector-arrow"
                onClick={() => change(-1)}
                aria-label="Hambúrguer anterior"
              >
                <ArrowLeft size={19} />
              </button>
              <div className="burger-thumbnails">
                <div className="burger-track" ref={track} data-moving={motion ? "true" : undefined}>
                  {thumbnailOrder.map((i, slot) => {
                    const item = slides[i];
                    const p = products.find(p => p.id === item.id)!;
                    const visible = slot >= firstVisibleSlot && slot <= firstVisibleSlot + 2;
                    return (
                      <button
                        key={slot}
                        className={`burger-thumbnail ${slot === selectedSlot ? "is-selected" : ""}`}
                        onClick={() => select(i)}
                        aria-label={`Destacar ${p.name}`}
                        aria-pressed={slot === selectedSlot}
                        aria-hidden={!visible}
                        tabIndex={visible ? 0 : -1}
                        disabled={!visible}
                      >
                        <span className="thumbnail-image">
                          <FoodImage key={item.id} src={item.image} alt="" sizes="256px" quality={90} loading="eager" />
                        </span>
                        <span className="thumbnail-name">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
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
                  className={i === activeIndex ? "is-selected" : ""}
                  aria-label={`Destaque ${i + 1}`}
                  aria-pressed={i === activeIndex}
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
              className={`showcase-food ${i === activeIndex ? "is-active" : ""}`}
              key={item.id}
              ref={(node) => {
                if (node) heroNodes.current.set(item.id, node);
                else heroNodes.current.delete(item.id);
              }}
              aria-hidden={i !== activeIndex}
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
          0{activeIndex + 1} <span>/ 03</span>
        </span>
      </div>
    </section>
  );
}
