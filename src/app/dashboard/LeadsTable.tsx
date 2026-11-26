import Link from "next/link";
import type { LeadDTO } from "@/lib/leads";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

export function LeadsTable({ leads }: { leads: LeadDTO[] }) {
  return (
    <>
      <ul className="space-y-3 md:hidden">
        {leads.map((lead) => (
          <li key={lead.id}>
            <Link href={`/leads/${lead.id}`} className="card block p-4 transition hover:border-brand">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold">{lead.companyName}</p>
                <StatusBadge status={lead.status} />
              </div>
              <p className="mt-1 text-sm text-zinc-600">{lead.contactName}</p>
              <p className="mt-2 text-xs text-zinc-500">
                {lead.stateZone} · {lead.businessType} · {formatDate(lead.createdAt)}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="card hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-zinc-200 text-sm">
          <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Tipo de negocio</th>
              <th className="px-4 py-3">Volumen</th>
              <th className="px-4 py-3">Estatus</th>
              <th className="px-4 py-3">Recibido</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="group hover:bg-zinc-50">
                <td className="px-4 py-3 font-semibold">
                  <Link href={`/leads/${lead.id}`} className="group-hover:text-brand">
                    {lead.companyName}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p>{lead.contactName}</p>
                  <p className="text-xs text-zinc-500">{lead.email}</p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{lead.stateZone}</td>
                <td className="px-4 py-3">{lead.businessType}</td>
                <td className="px-4 py-3 whitespace-nowrap text-zinc-600">{lead.estimatedVolume}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-zinc-500">{formatDate(lead.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
