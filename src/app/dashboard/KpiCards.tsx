import type { LeadStats } from "@/lib/leads";

export function KpiCards({ stats }: { stats: LeadStats }) {
  const items = [
    { label: "Total de solicitudes", value: stats.total, accent: "bg-ink" },
    { label: "Nuevos", value: stats.nuevos, accent: "bg-sky-500" },
    { label: "En revisión", value: stats.enRevision, accent: "bg-violet-500" },
    { label: "Aprobados", value: stats.aprobados, accent: "bg-emerald-500" },
  ];
  return (
    <section aria-label="Indicadores" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="card relative overflow-hidden p-4">
          <span className={`absolute inset-y-0 left-0 w-1 ${item.accent}`} aria-hidden="true" />
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{item.label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums">{item.value}</p>
        </div>
      ))}
    </section>
  );
}
