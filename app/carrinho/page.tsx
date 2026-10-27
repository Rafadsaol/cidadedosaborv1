import { PageHeading } from "@/components/ui/section-heading";
import { CartPage } from "@/components/cart-page";
export const metadata = { title: "Meu carrinho" };
export default function Page() {
  return (
    <>
      <PageHeading
        eyebrow="SUA SELEÇÃO DE SABORES"
        title="Só tem coisa boa aqui."
        description="Ajuste as quantidades e confira sua combinação. Carrinho demonstrativo, sem envio de pedidos."
      />
      <CartPage />
    </>
  );
}
