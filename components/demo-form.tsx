"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Info } from "lucide-react";
export function DemoForm({
  kind
}: {
  kind: "contact";
}) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  return <form className="demo-form" data-kind={kind} onSubmit={event => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get("name")).trim().length < 2) {
      setError("Informe um nome com pelo menos dois caracteres.");
      return;
    }
    form.reset();
    setError("");
    setSuccess(true);
  }} onChange={() => {
    setSuccess(false);
    setError("");
  }}>
    <div className="form-notice"><Info size={18} /><span>Este é um formulário demonstrativo. Use dados fictícios; nenhuma informação será enviada.</span></div>
    <div className="form-fields">
      <label className="wide">Seu nome<input name="name" autoComplete="off" placeholder="Como podemos chamar você?" minLength={2} maxLength={80} required /></label>
      <label className="wide">E-mail<input name="email" type="email" autoComplete="off" placeholder="voce@exemplo.com" required maxLength={120} /></label>
      <label className="wide">Assunto<select name="subject" required defaultValue=""><option value="" disabled>Sobre o que vamos conversar?</option><option>Dúvidas sobre o cardápio</option><option>Eventos e parcerias</option><option>Sugestões</option><option>Outros assuntos</option></select></label>
      <label className="wide">Sua mensagem<textarea name="message" placeholder="Conta pra gente…" minLength={10} maxLength={1000} rows={5} required /></label>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button full-width" type="submit">Simular envio <ArrowUpRight size={18} /></button>
    <div aria-live="polite">{success && <p className="form-success" role="status"><CheckCircle2 size={21} />Formulário validado! Nenhuma mensagem foi enviada.</p>}</div>
  </form>;
}
