import Link from "next/link";
import type { LeadDTO } from "@/lib/leads";
import { LEAD_STATUSES, STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";

const COLUMN_ACCENT: Record<(typeof LEAD_STATUSES)[number], string> = {
  NUEVO: "border-t-sky-500",
  CONTACTADO: "border-t-amber-500",
  EN_REVISION: "border-t-violet-500",
  APROBADO: "border-t-emerald-500",
  RECHAZADO: "border-t-brand",
};

export function KanbanBoard({ leads }: { leads: LeadDTO[] }) {
  return (
    <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      {LEAD_STATUSES.map((status) => {
        const columnLeads = leads.filter((l) => l.status === status);
        return (
          <section
            key={status}
            aria-label={STATUS_LABELS[status]}
            className={`flex w-72 shrink-0 snap-start flex-col rounded-xl border border-t-4 border-zinc-200 bg-zinc-100/70 ${COLUMN_ACCENT[status]}`}
          >
            <header className="flex items-center justify-between px-3 py-2">
              <h2 className="text-sm font-semibold">{STATUS_LABELS[status]}</h2>
              <span className="rounded-full bg-white px-2 text-xs font-semibold tabular-nums text-zinc-600">{columnLeads.length}</span>
            </header>
            <ul className="flex-1 space-y-2 px-2 pb-2">
              {columnLeads.length === 0 && <li className="px-2 py-6 text-center text-xs text-zinc-400">Sin prospectos</li>}
              {columnLeads.map((lead) => (
                <li key={lead.id}>
                  <Link href={`/leads/${lead.id}`} className="block rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition hover:border-brand">
                    <p className="text-sm font-semibold">{lead.companyName}</p>
                    <p className="text-xs text-zinc-600">{lead.contactName}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                      <span>{lead.stateZone}</span>
                      <span>{formatDate(lead.createdAt)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
