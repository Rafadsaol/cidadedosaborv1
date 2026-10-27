import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toast } from "@/components/ui/toast";
export const metadata: Metadata = {
  title: {
    default: "Cidade do Sabor | O sabor que domina a cidade",
    template: "%s | Cidade do Sabor",
  },
  description:
    "Hambúrgueres artesanais, ingredientes selecionados e personalidade de sobra. Conheça o protótipo Cidade do Sabor.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <CartProvider>
          <a href="#main" className="skip-link">
            Pular para o conteúdo
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <Toast />
        </CartProvider>
      </body>
    </html>
  );
}
