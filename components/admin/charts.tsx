"use client";

import { money } from "@/lib/utils";
type Datum = {
  label: string;
  value: number;
};
// Biblioteca local de gráficos React/SVG: sem rede, canvas ou dependências de runtime.
export function BarChart({
  title,
  data,
  currency = false,
  color = "#FFB347"
}: {
  title: string;
  data: Datum[];
  currency?: boolean;
  color?: string;
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  const format = (value: number) => currency ? money(value) : String(value);
  return <div className="demo-chart"><svg viewBox={`0 0 560 ${Math.max(140, data.length * 45 + 20)}`} role="img" aria-label={`${title}: ${data.map(d => `${d.label}, ${format(d.value)}`).join("; ")}`}>
    {data.length ? data.map((d, i) => <g key={d.label}><text x="0" y={i * 45 + 20} fill="#b8b8b8" fontSize="12">{d.label.length > 22 ? `${d.label.slice(0, 21)}…` : d.label}</text><rect x="165" y={i * 45 + 6} width="295" height="22" rx="5" fill="#ffffff08" /><rect x="165" y={i * 45 + 6} width={d.value / max * 295} height="22" rx="5" fill={color} /><text x="475" y={i * 45 + 21} fill="#fff" fontSize="11">{format(d.value)}</text></g>) : <text x="12" y="65" fill="#b8b8b8" fontSize="14">Nenhum produto vendido no período.</text>}
  </svg><details className="chart-data"><summary>Ver dados de {title.toLowerCase()}</summary><table><caption className="sr-only">{title}</caption><thead><tr><th scope="col">Indicador</th><th scope="col">Valor</th></tr></thead><tbody>{data.map(d => <tr key={d.label}><th scope="row">{d.label}</th><td>{format(d.value)}</td></tr>)}</tbody></table></details></div>;
}
export function DailyChart({
  title,
  data,
  currency = false
}: {
  title: string;
  data: Datum[];
  currency?: boolean;
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  return <div className="daily-chart"><svg viewBox="0 0 560 235" role="img" aria-label={`${title}: ${data.map(d => `${d.label}, ${currency ? money(d.value) : d.value}`).join("; ")}`}>
    {[0, 1, 2, 3].map(i => <line key={i} x1="20" x2="540" y1={25 + i * 50} y2={25 + i * 50} stroke="#ffffff0c" />)}
    {data.map((d, i) => {
        const height = d.value / max * 140;
        const x = 28 + i * 76;
        return <g key={d.label}><title>{d.label}: {currency ? money(d.value) : d.value}</title><rect x={x} y={180 - height} width="38" height={height} rx="5" fill={currency ? "#E34B35" : "#FFB347"} /><text x={x + 19} y={166 - height} textAnchor="middle" fill="#fff" fontSize="11">{currency ? money(d.value) : d.value}</text><text x={x + 19} y="210" textAnchor="middle" fill="#b8b8b8" fontSize="11">{d.label}</text></g>;
      })}
  </svg><details className="chart-data"><summary>Ver dados de {title.toLowerCase()}</summary><table><caption className="sr-only">{title}</caption><thead><tr><th scope="col">Dia</th><th scope="col">{currency ? "Receita fictícia" : "Pedidos"}</th></tr></thead><tbody>{data.map(d => <tr key={d.label}><th scope="row">{d.label}</th><td>{currency ? money(d.value) : d.value}</td></tr>)}</tbody></table></details></div>;
}
