"use client";

import { usePathname } from "next/navigation";
import { Header } from "./layout/header";
import { Footer } from "./layout/footer";
export function SiteFrame({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const admin = pathname.startsWith("/admin");
  const caseStudy = pathname === "/case-study";
  return <><a href="#main" className="skip-link">Pular para o conteúdo</a>{!admin && !caseStudy && <Header />}<main id="main">{children}</main>{!admin && <Footer />}</>;
}
