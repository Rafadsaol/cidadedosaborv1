"use client";

import { useState } from "react";
import { CalendarDays, Users } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import type { DemoReservation } from "@/types/demo";
import { AdminHeading } from "./admin-shell";
import { StatusBadge } from "@/components/orders/order-details";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
export function AdminReservations() {
  const {
    reservations,
    changeReservation
  } = useDemo();
  const [date, setDate] = useState("");
  const [cancel, setCancel] = useState<DemoReservation | null>(null);
  const filtered = reservations.filter(r => !date || r.date === date).toSorted((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  return <div className="admin-page"><AdminHeading eyebrow="BONS MOMENTOS COMEÇAM À MESA" title="Uma mesa para cada história." description="Organize as reservas demonstrativas. Nenhuma disponibilidade real é consultada ou garantida." /><div className="admin-filters"><label>Filtrar por data<input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>{date && <button className="text-link" onClick={() => setDate("")}>Limpar data</button>}<span>{filtered.length} reservas locais</span></div><div className="admin-reservation-grid">{filtered.map(r => <article className="admin-panel" key={r.id}><div className="reservation-card-heading"><CalendarDays size={25} /><StatusBadge status={r.status} /></div><span className="eyebrow">{r.sample ? "DADO DE EXEMPLO" : "RESERVA DE TESTE"}</span><h2>{r.date.split("-").reverse().join("/")} · {r.time}</h2><p><strong>{r.name}</strong> · {r.phone}</p><p className="reservation-people"><Users size={16} /> {r.people} {r.people === 1 ? "pessoa" : "pessoas"}</p>{r.notes && <p className="reservation-notes">{r.notes}</p>}<div className="demo-action-row">{r.status === "Pendente" && <button className="button" onClick={() => changeReservation(r.id, "Confirmada")}>Confirmar reserva</button>}{r.status !== "Cancelada" && <button className="button button-outline" onClick={() => setCancel(r)}>Cancelar reserva</button>}</div></article>)}{!filtered.length && <div className="admin-panel admin-empty"><h2>Nenhuma reserva nesta seleção.</h2><p>Escolha outra data ou registre uma reserva de teste na loja.</p></div>}</div><ConfirmDialog open={!!cancel} onClose={() => setCancel(null)} onConfirm={() => {
      if (cancel) changeReservation(cancel.id, "Cancelada");
    }} title="Cancelar reserva de teste?" description="A reserva será marcada como cancelada neste navegador. Nenhum cliente real será contatado." confirmLabel="Sim, cancelar reserva" cancelLabel="Manter reserva" /></div>;
}
