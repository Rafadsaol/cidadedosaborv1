import { PageHeading } from "@/components/ui/section-heading";
import { Catalog } from "@/components/products/catalog";
export const metadata = { title: "Cardápio" };
export default function MenuPage() {
  return (
    <>
      <PageHeading
        eyebrow="A CHAPA TÁ QUENTE"
        title="Seu próximo favorito está aqui."
        description="Burgers com personalidade, acompanhamentos de respeito e aquele final doce. Escolha o seu sabor."
      />
      <Catalog />
    </>
  );
}
