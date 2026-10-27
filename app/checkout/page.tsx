import { PageHeading } from "@/components/ui/section-heading";
import { CheckoutPage } from "@/components/checkout/checkout-page";
export const metadata = { title: "Checkout demonstrativo" };
export default function Page() {
  return (
    <>
      <PageHeading
        eyebrow="ÚLTIMA PARADA · SÓ UMA SIMULAÇÃO"
        title="Seu sabor. Do seu jeito."
        description="Experimente o fechamento do pedido com dados fictícios. Não há envio ao restaurante, pagamento, entrega ou reserva de retirada."
      />
      <CheckoutPage />
    </>
  );
}
