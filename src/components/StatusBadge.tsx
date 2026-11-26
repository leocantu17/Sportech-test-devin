import { STATUS_LABELS, STATUS_STYLES, type LeadStatusValue } from "@/lib/constants";

export function StatusBadge({ status }: { status: LeadStatusValue }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
