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
import { useCart } from "@/components/cart-provider";
import { OrderSummary } from "./order-summary";
import { states } from "@/data/customization";
import { emptyCheckout, paymentLabels, validateCheckout } from "@/lib/checkout";
import type { CartItem, CheckoutData } from "@/types";
export function CheckoutPage() {
  const { items, ready } = useCart();
  const [data, setData] = useState<CheckoutData>(emptyCheckout);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutData, string>>
  >({});
  const [result, setResult] = useState<{
    data: CheckoutData;
    items: CartItem[];
  } | null>(null);
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
          <h2>Tudo pronto para imaginar seu próximo pedido.</h2>
          <p>
            <strong>Nenhum pedido foi enviado ao restaurante.</strong> Nenhum
            pagamento foi processado, nenhuma entrega ou retirada foi agendada.
          </p>
        </div>
        <div className="checkout-layout">
          <div className="form-panel">
            <h3>Dados usados nesta demonstração</h3>
            <p>
              {result.data.name} · {result.data.phone}
            </p>
            <p>
              {result.data.fulfillment === "delivery"
                ? "Delivery simulado"
                : "Retirada no balcão simulada"}
            </p>
            {result.data.fulfillment === "delivery" && (
              <p>
                {result.data.street}, {result.data.number}
                {result.data.complement ? ` · ${result.data.complement}` : ""}
                <br />
                {result.data.neighborhood} · {result.data.city}/
                {result.data.state} · CEP {result.data.cep}
                {result.data.reference && (
                  <>
                    <br />
                    Referência: {result.data.reference}
                  </>
                )}
              </p>
            )}
            <p>
              Forma de pagamento ilustrativa:{" "}
              {paymentLabels[result.data.payment]} · sem cobrança.
            </p>
            <div className="info-box">
              <Info size={18} />
              Os dados deste formulário ficam apenas nesta tela, em memória. Seu
              carrinho foi mantido para outros testes.
            </div>
            <Link href="/cardapio" className="button">
              Voltar ao cardápio <ArrowRight size={18} />
            </Link>
          </div>
          <OrderSummary
            items={result.items}
            delivery={result.data.fulfillment === "delivery"}
          />
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
          setResult({ data: { ...data }, items: structuredClone(items) });
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
            pedido é enviado, nenhum pagamento é feito e nenhum dado do
            formulário é salvo no navegador.
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
