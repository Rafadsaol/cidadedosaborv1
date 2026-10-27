"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Info, Eye, EyeOff } from "lucide-react";
import { localDate } from "@/lib/utils";
type Kind = "reservation" | "contact" | "login" | "register";
const copy = {
  reservation: {
    button: "Simular reserva",
    message: "Simulação concluída! Nenhuma reserva real foi realizada.",
  },
  contact: {
    button: "Simular envio",
    message: "Formulário validado! Nenhuma mensagem foi enviada.",
  },
  login: {
    button: "Visualizar acesso",
    message:
      "Interface demonstrativa. Nenhuma sessão foi iniciada e sua senha não foi armazenada.",
  },
  register: {
    button: "Simular cadastro",
    message:
      "Interface demonstrativa. Nenhuma conta foi criada e sua senha não foi armazenada.",
  },
};
export function DemoForm({ kind }: { kind: Kind }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isAuth = kind === "login" || kind === "register";
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(false);
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    if (kind !== "login" && String(data.get("name")).trim().length < 2) {
      setError("Informe um nome com pelo menos dois caracteres.");
      form.querySelector<HTMLInputElement>('[name="name"]')?.focus();
      return;
    }
    if (kind === "reservation") {
      const digits = String(data.get("phone")).replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 11) {
        setError("Informe um telefone com DDD, com 10 ou 11 dígitos.");
        form.querySelector<HTMLInputElement>('[name="phone"]')?.focus();
        return;
      }
      const date = String(data.get("date"));
      const time = String(data.get("time"));
      if (
        date < localDate() ||
        new Date(`${date}T${time}:00`).getTime() <= Date.now()
      ) {
        setError("Escolha uma data e um horário futuros para a simulação.");
        form.querySelector<HTMLInputElement>('[name="date"]')?.focus();
        return;
      }
    }
    if (
      kind === "register" &&
      data.get("password") !== data.get("confirmation")
    ) {
      setError("As senhas precisam ser iguais. Elas não serão armazenadas.");
      form.querySelector<HTMLInputElement>('[name="confirmation"]')?.focus();
      return;
    }
    setPending(true);
    form.reset();
    setShowPassword(false);
    setPending(false);
    setSuccess(true);
  }
  return (
    <form
      className="demo-form"
      onSubmit={submit}
      onChange={() => {
        setSuccess(false);
        setError("");
      }}
    >
      <div className="form-notice">
        <Info size={18} />
        <span>
          {isAuth
            ? "Apenas uma interface visual. Use dados fictícios; não há autenticação nem armazenamento de senhas."
            : "Este é um formulário demonstrativo. Use dados fictícios; nenhuma informação será enviada."}
        </span>
      </div>
      <div className="form-fields">
        {kind !== "login" && (
          <label className="wide">
            Seu nome
            <input
              name="name"
              autoComplete="off"
              placeholder="Como podemos chamar você?"
              minLength={2}
              maxLength={80}
              required
            />
          </label>
        )}
        {kind === "reservation" ? (
          <>
            <label className="wide">
              Telefone com DDD
              <input
                name="phone"
                type="tel"
                autoComplete="off"
                placeholder="(11) 99999-9999"
                required
                maxLength={20}
              />
            </label>
            <label>
              Data
              <input name="date" type="date" min={localDate()} required />
            </label>
            <label>
              Horário
              <select aria-label="Horário" name="time" required defaultValue="">
                <option value="" disabled>
                  Selecione
                </option>
                {[
                  "18:00",
                  "18:30",
                  "19:00",
                  "19:30",
                  "20:00",
                  "20:30",
                  "21:00",
                  "21:30",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="wide">
              Quantidade de pessoas
              <select
                aria-label="Quantidade de pessoas"
                name="people"
                required
                defaultValue="2"
              >
                <option value="1">1 pessoa</option>
                {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option value={n} key={n}>
                    {n} pessoas
                  </option>
                ))}
              </select>
            </label>
            <label className="wide">
              Observações <span className="muted">(opcional)</span>
              <textarea
                name="notes"
                placeholder="Alguma preferência para o seu momento?"
                rows={3}
                maxLength={500}
              />
            </label>
          </>
        ) : (
          <label className="wide">
            E-mail
            <input
              name="email"
              type="email"
              autoComplete="off"
              placeholder="voce@exemplo.com"
              required
              maxLength={120}
            />
          </label>
        )}
        {kind === "contact" && (
          <>
            <label className="wide">
              Assunto
              <select
                aria-label="Assunto"
                name="subject"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Sobre o que vamos conversar?
                </option>
                <option>Dúvidas sobre o cardápio</option>
                <option>Eventos e parcerias</option>
                <option>Sugestões</option>
                <option>Outros assuntos</option>
              </select>
            </label>
            <label className="wide">
              Sua mensagem
              <textarea
                name="message"
                placeholder="Conta pra gente…"
                minLength={10}
                maxLength={1000}
                rows={5}
                required
              />
            </label>
          </>
        )}
        {isAuth && (
          <>
            <label className="wide">
              Senha{" "}
              <span className="muted">(fictícia, mínimo 8 caracteres)</span>
              <span className="password-field">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  minLength={8}
                  maxLength={128}
                  placeholder="Use uma senha fictícia"
                  required
                />
                <button
                  type="button"
                  className="icon-button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            {kind === "register" && (
              <label className="wide">
                Confirme a senha
                <input
                  name="confirmation"
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  minLength={8}
                  maxLength={128}
                  placeholder="Repita a senha fictícia"
                  required
                />
              </label>
            )}
          </>
        )}
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button full-width" disabled={pending} type="submit">
        {pending ? "Validando…" : copy[kind].button}
        <ArrowUpRight size={18} />
      </button>
      <div aria-live="polite">
        {success && (
          <p className="form-success" role="status">
            <CheckCircle2 size={21} />
            {copy[kind].message}
          </p>
        )}
      </div>
      {isAuth && (
        <p className="auth-switch">
          {kind === "login" ? "Primeira vez por aqui?" : "Já conhece a cidade?"}{" "}
          <Link href={kind === "login" ? "/cadastro" : "/login"}>
            {kind === "login" ? "Conheça o cadastro" : "Voltar ao login"} →
          </Link>
        </p>
      )}
    </form>
  );
}
