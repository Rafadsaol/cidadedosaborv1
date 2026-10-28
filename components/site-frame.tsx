"use client";

import { usePathname } from "next/navigation";
import { Header } from "./layout/header";
import { Footer } from "./layout/footer";
export function SiteFrame({
  children
}: {
  children: React.ReactNode;
}) {
  const admin = usePathname().startsWith("/admin");
  return <><a href="#main" className="skip-link">Pular para o conteúdo</a>{!admin && <Header />}<main id="main">{children}</main>{!admin && <Footer />}</>;
}
