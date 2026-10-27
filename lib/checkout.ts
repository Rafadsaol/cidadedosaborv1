import { states } from "@/data/customization";
import type { CheckoutData } from "@/types";
export const paymentLabels = {
  pix: "PIX",
  credit: "Cartão de crédito",
  debit: "Cartão de débito",
  cash: "Dinheiro",
};
export const emptyCheckout: CheckoutData = {
  name: "",
  phone: "",
  fulfillment: "delivery",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  reference: "",
  payment: "pix",
};
export function validateCheckout(
  data: CheckoutData,
): Partial<Record<keyof CheckoutData, string>> {
  const errors: Partial<Record<keyof CheckoutData, string>> = {};
  if (data.name.trim().length < 2 || data.name.trim().length > 80)
    errors.name = "Informe um nome entre 2 e 80 caracteres.";
  if (!/^\d{10,11}$/.test(data.phone.replace(/\D/g, "")))
    errors.phone = "Informe um telefone com DDD (10 ou 11 dígitos).";
  if (!["delivery", "pickup"].includes(data.fulfillment))
    errors.fulfillment = "Escolha delivery ou retirada.";
  if (!Object.hasOwn(paymentLabels, data.payment))
    errors.payment = "Selecione uma forma de pagamento demonstrativa.";
  if (data.fulfillment === "delivery") {
    if (!/^\d{8}$/.test(data.cep.replace(/\D/g, "")))
      errors.cep = "Informe um CEP com 8 dígitos. Não há consulta de entrega.";
    for (const [key, label] of [
      ["street", "a rua"],
      ["number", "o número ou S/N"],
      ["neighborhood", "o bairro"],
      ["city", "a cidade"],
    ] as const)
      if (!data[key].trim() || data[key].length > 120)
        errors[key] = `Informe ${label}.`;
    if (!states.includes(data.state)) errors.state = "Selecione um estado.";
  }
  return errors;
}
