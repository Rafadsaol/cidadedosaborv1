"use client";

import { useState } from "react";
import { RotateCcw, Database, ShieldCheck, MapPin, FlaskConical } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { AdminHeading } from "./admin-shell";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
export function AdminSettings() {
  const {
    products,
    orders,
    reservations,
    restoreAll,
    persistent
  } = useDemo();
  const [confirm, setConfirm] = useState(false);
  return <div className="admin-page"><AdminHeading eyebrow="SEU AMBIENTE DE TESTES" title="Tudo pronto para explorar." description="Conheça os limites da demonstração e reinicie seus testes quando quiser." /><div className="admin-settings-grid"><section className="admin-panel"><Database size={26} /><h2>Dados deste navegador</h2><p>{products.length} produtos · {orders.length} pedidos · {reservations.length} reservas</p><dl className="settings-list"><div><dt>Persistência</dt><dd>{persistent ? "localStorage disponível" : "Somente em memória"}</dd></div><div><dt>Sincronização</dt><dd>Abas do mesmo endereço e navegador</dd></div><div><dt>Limites locais</dt><dd>200 produtos · 500 pedidos · 500 reservas</dd></div><div><dt>Compartilhamento</dt><dd>Computador e celular têm dados separados</dd></div></dl></section><section className="admin-panel"><ShieldCheck size={26} /><h2>Acessos demonstrativos</h2><p>Cliente Teste · perfil customer<br />Administrador · perfil admin</p><p>Sem senhas, autenticação ou proteção real. A escolha de perfil é apenas uma simulação visual de permissões.</p><p>Nenhum pagamento é processado e nenhum pedido, reserva ou mensagem é enviado.</p></section><section className="admin-panel"><MapPin size={26} /><h2>Cidade do Sabor</h2><p>Rua do Sabor, 123 · Centro · Curitiba, PR</p><p>Informações ilustrativas da hamburgueria fictícia. Preços e opções do cardápio são editáveis na seção Cardápio.</p><p>Frete demonstrativo: R$ 6,00. Não há consulta de endereço, região ou prazo de entrega.</p></section><section className="admin-panel reset-panel"><FlaskConical size={26} /><h2>Um novo começo</h2><p>Restaure os dados de exemplo e comece outra rodada de testes. Esta ação apagará os pedidos, reservas e alterações do cardápio da V3 neste navegador. O carrinho e a preferência de animação serão mantidos.</p><button className="button" onClick={() => setConfirm(true)}><RotateCcw size={17} /> Restaurar dados de demonstração</button></section></div><ConfirmDialog open={confirm} onClose={() => setConfirm(false)} onConfirm={restoreAll} title="Apagar alterações locais da V3?" description="Todos os pedidos e reservas de teste, produtos novos e edições serão apagados neste navegador. Os dados de exemplo serão restaurados. Essa ação não pode ser desfeita. O carrinho será mantido." confirmLabel="Sim, restaurar demonstração" cancelLabel="Manter meus dados" /></div>;
}
