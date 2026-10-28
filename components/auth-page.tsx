"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, ArrowLeft, ArrowUpRight, UserRound, ShieldCheck, Info } from "lucide-react";
import { FoodImage } from "./ui/food-image";
import { useDemo } from "./demo-provider";
export function AuthPage({
  register = false
}: {
  register?: boolean;
}) {
  const {
    profile,
    login,
    ready
  } = useDemo();
  const router = useRouter();
  return <section className="container auth-layout">
    <div className="auth-photo"><FoodImage src="/images/hero.webp" alt="Hambúrguer da Cidade do Sabor" priority /><div><Flame size={35} /><h2>Uma cidade.<br />Duas experiências.</h2><p>Peça como cliente.<br />Explore a operação como administrador.</p></div></div>
    <div className="auth-panel">
      <Link className="text-link small" href="/"><ArrowLeft size={16} /> Voltar ao início</Link>
      <span className="eyebrow">CIDADE DO SABOR · V3 DEMONSTRATIVA</span>
      <h1>Escolha seu perfil.</h1>
      <p className="muted">{register ? "Você já tem dois acessos de teste prontos para explorar." : "Entre em uma experiência completa, sem cadastro ou senha."}</p>
      <div className="profile-options">
        {([{
          role: "customer",
          name: "Cliente Teste",
          label: "Cliente Demo",
          description: "Monte seu pedido, acompanhe o status e planeje uma visita.",
          Icon: UserRound
        }, {
          role: "admin",
          name: "Administrador",
          label: "Administrador Demo",
          description: "Gerencie pedidos, cardápio e reservas. Veja os resultados da sua operação fictícia.",
          Icon: ShieldCheck
        }] as const).map(({
          role,
          name,
          label,
          description,
          Icon
        }) => <button key={role} className="profile-option" disabled={!ready} onClick={() => {
          login(role);
          router.push(role === "admin" ? "/admin" : "/meus-pedidos");
        }}><Icon size={25} /><span><small>{label}{profile === role ? " · perfil atual" : ""}</small><strong>{name}</strong><span>{description}</span></span><ArrowUpRight size={20} /></button>)}
      </div>
      <div className="info-box"><Info size={19} /><p>Acesso demonstrativo, sem autenticação ou segurança real. Os dois perfis compartilham os dados deste navegador. Use apenas dados fictícios.</p></div>
      {profile && <button className="text-link demo-logout" onClick={() => login(null)}>Sair do perfil demonstrativo</button>}
    </div>
  </section>;
}
