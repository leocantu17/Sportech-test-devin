"use client";

import { useState } from "react";
import { LEAD_STATUSES, STATUS_LABELS, type LeadStatusValue } from "@/lib/constants";
import { apiFetch, ApiError } from "@/lib/api";
import { Spinner } from "@/components/Spinner";
import { StatusBadge } from "@/components/StatusBadge";

type SaveState = "idle" | "saving" | "saved" | "error";

export function StatusSelect({ leadId, initialStatus }: { leadId: string; initialStatus: LeadStatusValue }) {
  const [status, setStatus] = useState(initialStatus);
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onChange(next: LeadStatusValue) {
    const previous = status;
    setStatus(next);
    setState("saving");
    setError(null);
    try {
      await apiFetch(`/api/leads/${leadId}`, { method: "PATCH", body: JSON.stringify({ status: next }) });
      setState("saved");
    } catch (err) {
      setStatus(previous);
      setState("error");
      setError(err instanceof ApiError ? err.message : "No se pudo actualizar el estatus");
    }
  }

  return (
    <div className="card w-full p-4 sm:w-64">
      <div className="flex items-center justify-between">
        <label htmlFor="status" className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Estatus
        </label>
        <StatusBadge status={status} />
      </div>
      <select
        id="status"
        className="input mt-2"
        value={status}
        disabled={state === "saving"}
        onChange={(e) => onChange(e.target.value as LeadStatusValue)}
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <p className="mt-2 flex min-h-4 items-center gap-1.5 text-xs" aria-live="polite">
        {state === "saving" && (
          <span className="inline-flex items-center gap-1.5 text-zinc-500">
            <Spinner className="h-3 w-3" /> Guardando…
          </span>
        )}
        {state === "saved" && <span className="text-emerald-600">✓ Estatus actualizado</span>}
        {state === "error" && <span className="text-brand">{error}</span>}
      </p>
    </div>
  );
}
