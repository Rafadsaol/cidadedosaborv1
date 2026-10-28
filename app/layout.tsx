import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "./globals.css";
import { DemoProvider } from "@/components/demo-provider";
import { CartProvider } from "@/components/cart-provider";
import { SiteFrame } from "@/components/site-frame";
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
        <DemoProvider>
          <CartProvider>
            <SiteFrame>{children}</SiteFrame>
            <Toast />
          </CartProvider>
        </DemoProvider>
      </body>
    </html>
  );
}
