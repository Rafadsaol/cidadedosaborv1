"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Bike,
  CheckCircle2,
  Info,
  ShoppingBag,
  Store,
  WalletCards,
} from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { OrderDetails } from "@/components/orders/order-details";
import type { DemoOrder } from "@/types/demo";
import { useCart } from "@/components/cart-provider";
import { OrderSummary } from "./order-summary";
import { states } from "@/data/customization";
import { emptyCheckout, paymentLabels, validateCheckout } from "@/lib/checkout";
import type { CheckoutData } from "@/types";
export function CheckoutPage() {
  const { items, ready, clear } = useCart();
  const { placeOrder, orders, persistent } = useDemo();
  const [data, setData] = useState<CheckoutData>(emptyCheckout);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutData, string>>
  >({});
  const [result, setResult] = useState<DemoOrder | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const success = useRef<HTMLDivElement>(null);
  const change = (key: keyof CheckoutData, value: string) => {
    setData((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };
  const field = (
    key: keyof CheckoutData,
    label: string,
    placeholder: string,
    props: {
      type?: string;
      optional?: boolean;
      maxLength?: number;
      inputMode?: "tel" | "numeric";
    } = {},
  ) => (
    <label
      className={`checkout-field ${["street", "complement", "reference"].includes(key) ? "wide" : ""}`}
      htmlFor={`checkout-${key}`}
    >
      {label}
      {props.optional && <span> (opcional)</span>}
      <input
        id={`checkout-${key}`}
        aria-label={label}
        name={key}
        value={data[key]}
        onChange={(event) => change(key, event.target.value)}
        placeholder={placeholder}
        type={props.type || "text"}
        inputMode={props.inputMode}
        autoComplete="off"
        maxLength={props.maxLength || 120}
        required={!props.optional}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `checkout-${key}-error` : undefined}
      />
      {errors[key] && (
        <small className="field-error" id={`checkout-${key}-error`}>
          {errors[key]}
        </small>
      )}
    </label>
  );
  if (!ready)
    return (
      <div className="container empty-state" role="status">
        Carregando sua combinação…
      </div>
    );
  if (result)
    return (
      <div className="container checkout-success" ref={success} tabIndex={-1}>
        <div className="success-heading">
          <CheckCircle2 size={55} />
          <span className="eyebrow">SIMULAÇÃO CONCLUÍDA</span>
          <h2>Seu pedido de teste foi recebido.</h2>
          <p>
            <strong>Nenhum pedido foi enviado ao restaurante.</strong> Nenhum
            pagamento foi processado, nenhuma entrega ou retirada foi agendada.
          </p>
        </div>
        <div className="form-panel">
          <OrderDetails order={orders.find(o => o.id === result.id) || result} />
          <div className="info-box"><Info size={18} />{persistent ? "Pedido de teste salvo no histórico deste navegador. Seu carrinho foi esvaziado para o próximo teste." : "Armazenamento indisponível. Este pedido está somente na memória desta aba."}</div>
          <div className="demo-action-row"><Link href="/meus-pedidos" className="button">Acompanhar pedido <ArrowRight size={18} /></Link><Link href="/cardapio" className="text-link">Voltar ao cardápio</Link></div>
        </div>
      </div>
    );
  if (!items.length)
    return (
      <div className="container empty-state">
        <ShoppingBag size={44} />
        <h2>Seu carrinho precisa de um sabor.</h2>
        <p>
          Adicione um produto antes de experimentar o checkout demonstrativo.
        </p>
        <Link href="/cardapio" className="button">
          Explorar cardápio <ArrowRight size={17} />
        </Link>
      </div>
    );
  return (
    <section className="container checkout-layout">
      <form
        ref={form}
        className="form-panel checkout-form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const problems = validateCheckout(data);
          setErrors(problems);
          const first = Object.keys(problems)[0];
          if (first) {
            form.current
              ?.querySelector<HTMLInputElement>(`[name="${first}"]`)
              ?.focus();
            return;
          }
          const order = placeOrder(items, data);
          if (!order) { setErrors({ name: "Não foi possível registrar. Revise o carrinho e tente novamente." }); return; }
          setResult(order);
          clear();
          setData(emptyCheckout);
          requestAnimationFrame(() => {
            success.current?.focus();
            success.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          });
        }}
      >
        <div className="form-notice">
          <Info size={18} />
          <span>
            Checkout exclusivamente demonstrativo. Use dados fictícios. Nenhum
            pedido real é enviado e nenhum pagamento é feito. Os dados fictícios informados serão salvos apenas neste navegador.
          </span>
        </div>
        <fieldset className="checkout-section">
          <legend>
            <span>01</span> Seus dados
          </legend>
          <div className="checkout-fields">
            {field("name", "Nome", "Seu nome fictício", { maxLength: 80 })}
            {field("phone", "Telefone", "(11) 99999-9999", {
              type: "tel",
              inputMode: "tel",
              maxLength: 20,
            })}
          </div>
        </fieldset>
        <fieldset className="checkout-section">
          <legend>
            <span>02</span> Como prefere receber?
          </legend>
          <div className="fulfillment-options">
            <label className={data.fulfillment === "delivery" ? "chosen" : ""}>
              <input
                type="radio"
                name="fulfillment"
                checked={data.fulfillment === "delivery"}
                onChange={() => change("fulfillment", "delivery")}
              />
              <Bike size={23} />
              <span>
                Delivery<small>Frete fictício · sem consulta de região</small>
              </span>
            </label>
            <label className={data.fulfillment === "pickup" ? "chosen" : ""}>
              <input
                type="radio"
                name="fulfillment"
                checked={data.fulfillment === "pickup"}
                onChange={() => {
                  change("fulfillment", "pickup");
                  setErrors({});
                }}
              />
              <Store size={23} />
              <span>
                Retirada no balcão<small>Sem agendamento real</small>
              </span>
            </label>
          </div>
        </fieldset>
        {data.fulfillment === "delivery" && (
          <fieldset className="checkout-section">
            <legend>
              <span>03</span> Endereço demonstrativo
            </legend>
            <p className="small muted">
              Preenchimento manual. Não consultamos CEP nem disponibilidade de
              entrega.
            </p>
            <div className="checkout-fields">
              {field("cep", "CEP", "00000-000", {
                inputMode: "numeric",
                maxLength: 9,
              })}
              {field("street", "Rua", "Rua fictícia")}
              {field("number", "Número", "123 ou S/N", { maxLength: 12 })}
              {field("complement", "Complemento", "Apartamento, bloco…", {
                optional: true,
              })}
              {field("neighborhood", "Bairro", "Bairro fictício")}
              {field("city", "Cidade", "Cidade fictícia")}
              <label className="checkout-field" htmlFor="checkout-state">
                Estado
                <select
                  id="checkout-state"
                  aria-label="Estado"
                  name="state"
                  value={data.state}
                  required
                  aria-invalid={!!errors.state}
                  aria-describedby={
                    errors.state ? "checkout-state-error" : undefined
                  }
                  onChange={(event) => change("state", event.target.value)}
                >
                  <option value="">Selecione</option>
                  {states.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </select>
                {errors.state && (
                  <small className="field-error" id="checkout-state-error">
                    {errors.state}
                  </small>
                )}
              </label>
              {field(
                "reference",
                "Referência",
                "Ponto de referência fictício",
                { optional: true, maxLength: 200 },
              )}
            </div>
          </fieldset>
        )}
        <fieldset className="checkout-section">
          <legend>
            <span>{data.fulfillment === "delivery" ? "04" : "03"}</span>{" "}
            Pagamento demonstrativo
          </legend>
          <p className="small muted">
            Escolha somente a modalidade. Não informe dados de cartão, chaves
            PIX ou senhas.
          </p>
          <div className="payment-options">
            {Object.entries(paymentLabels).map(([value, label]) => (
              <label
                key={value}
                className={data.payment === value ? "chosen" : ""}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={data.payment === value}
                  onChange={() => change("payment", value)}
                />
                <WalletCards size={18} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        {Object.values(errors).some(Boolean) && (
          <p className="form-error" role="alert">
            Revise os campos destacados para continuar a simulação.
          </p>
        )}
        <button type="submit" className="button full-width">
          Simular pedido <ArrowRight size={18} />
        </button>
        <p className="checkout-security">
          Nenhum valor será cobrado. Sua seleção não será enviada a terceiros.
        </p>
      </form>
      <OrderSummary items={items} delivery={data.fulfillment === "delivery"} />
    </section>
  );
}
