"use client";

import { useState } from "react";
import { CalendarDays, CheckCircle2, Info } from "lucide-react";
import { useDemo } from "./demo-provider";
import { customerId, reservationTimes } from "@/lib/demo";
import { localDate } from "@/lib/utils";
import { StatusBadge } from "./orders/order-details";
export function ReservationForm() {
  const {
    reserve,
    reservations,
    ready
  } = useDemo();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const mine = reservations.filter(r => r.customerId === customerId);
  return <><form className="demo-form" onSubmit={event => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const problem = reserve({
        name: String(data.get("name") || ""),
        phone: String(data.get("phone") || ""),
        date: String(data.get("date") || ""),
        time: String(data.get("time") || ""),
        people: Number(data.get("people")),
        notes: String(data.get("notes") || "")
      });
      setError(problem);
      setSuccess(!problem);
      if (!problem) form.reset();
    }} onChange={() => {
      setError("");
      setSuccess(false);
    }}>
    <div className="form-notice"><Info size={18} /><span>Use apenas contato e nome fictícios. A reserva fica salva neste navegador e pode ser gerenciada no painel demo. Nenhuma mesa real é reservada.</span></div>
    <div className="form-fields">
      <label>Seu nome<input name="name" required minLength={2} maxLength={80} autoComplete="off" placeholder="Cliente Teste" /></label>
      <label>Telefone com DDD<input name="phone" type="tel" required maxLength={20} autoComplete="off" placeholder="(41) 99999-0000" /></label>
      <label>Data<input name="date" type="date" required min={localDate()} /></label>
      <label>Horário<select aria-label="Horário" name="time" required defaultValue=""><option value="" disabled>Selecione</option>{reservationTimes.map(time => <option key={time}>{time}</option>)}</select></label>
      <label className="wide">Quantidade de pessoas<select aria-label="Quantidade de pessoas" name="people" defaultValue="2">{[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option value={n} key={n}>{n} {n === 1 ? "pessoa" : "pessoas"}</option>)}</select></label>
      <label className="wide">Observações (opcional)<textarea name="notes" rows={3} maxLength={500} placeholder="Preferências fictícias para sua visita" /></label>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button type="submit" className="button full-width" disabled={!ready}><CalendarDays size={18} /> Simular reserva</button>
    {success && <p className="form-success" role="status"><CheckCircle2 size={20} />Simulação concluída! Nenhuma reserva real foi realizada. Registro salvo neste navegador.</p>}
  </form>
  <div className="my-reservations"><h3>Suas reservas demonstrativas</h3>{!ready ? <p role="status">Carregando reservas…</p> : !mine.length ? <p>Nenhuma reserva local por enquanto.</p> : mine.map(r => <article key={r.id}><div><strong>{r.date.split("-").reverse().join("/")} · {r.time}</strong><p>{r.name} · {r.people} pessoas {r.sample ? "· Exemplo" : "· Teste"}</p></div><StatusBadge status={r.status} /></article>)}</div></>;
}
