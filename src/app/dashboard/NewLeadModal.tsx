"use client";

import { useEffect, useRef, useState } from "react";
import type { LeadDTO } from "@/lib/leads";
import { BUSINESS_TYPES, MX_STATES, VOLUME_OPTIONS } from "@/lib/constants";
import { leadCreateSchema } from "@/lib/validations";
import { apiFetch, ApiError } from "@/lib/api";
import { Alert } from "@/components/Alert";
import { Spinner } from "@/components/Spinner";

type Props = { open: boolean; onClose: () => void; onCreated: (lead: LeadDTO) => void };

const FIELDS = [
  { name: "companyName", label: "Empresa", type: "text", autoComplete: "organization" },
  { name: "contactName", label: "Nombre del contacto", type: "text", autoComplete: "name" },
  { name: "email", label: "Correo", type: "email", autoComplete: "email" },
  { name: "phone", label: "Teléfono", type: "tel", autoComplete: "tel" },
] as const;

const SELECTS = [
  { name: "stateZone", label: "Estado / zona", options: MX_STATES },
  { name: "businessType", label: "Tipo de negocio", options: BUSINESS_TYPES },
  { name: "estimatedVolume", label: "Volumen estimado", options: VOLUME_OPTIONS },
] as const;

export function NewLeadModal({ open, onClose, onCreated }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});

  useEffect(() => {
    if (!open) return;
    setError(null);
    setFieldErrors({});
    formRef.current?.reset();
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.getElementById("companyName")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>("input, select, textarea, button:not([disabled])");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!dialogRef.current.contains(document.activeElement)) {
        e.preventDefault();
        first?.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const parsed = leadCreateSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      const { lead } = await apiFetch<{ lead: LeadDTO }>("/api/leads", { method: "POST", body: JSON.stringify(parsed.data) });
      onCreated(lead);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo crear el prospecto");
      if (err instanceof ApiError && err.fieldErrors) setFieldErrors(err.fieldErrors);
    } finally {
      setLoading(false);
    }
  }

  const fieldError = (name: string) =>
    fieldErrors[name]?.[0] && <p className="mt-1 text-xs text-brand">{fieldErrors[name]![0]}</p>;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4" onClick={() => !loading && onClose()}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-lead-title"
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:max-w-lg sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <h2 id="new-lead-title" className="text-lg font-bold">
            Nuevo prospecto
          </h2>
          <button type="button" onClick={onClose} disabled={loading} className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100" aria-label="Cerrar">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
        <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-4 px-5 py-4">
          {error && <Alert>{error}</Alert>}
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.name}>
                <label htmlFor={f.name} className="mb-1 block text-sm font-medium text-zinc-700">
                  {f.label}
                </label>
                <input id={f.name} name={f.name} type={f.type} autoComplete={f.autoComplete} className="input" disabled={loading} />
                {fieldError(f.name)}
              </div>
            ))}
            {SELECTS.map((s) => (
              <div key={s.name} className={s.name === "estimatedVolume" ? "sm:col-span-2" : ""}>
                <label htmlFor={s.name} className="mb-1 block text-sm font-medium text-zinc-700">
                  {s.label}
                </label>
                <select id={s.name} name={s.name} defaultValue="" className="input" disabled={loading}>
                  <option value="" disabled>
                    Selecciona…
                  </option>
                  {s.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                {fieldError(s.name)}
              </div>
            ))}
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-zinc-200 pt-4 sm:flex-row sm:justify-end">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading && <Spinner />}
              {loading ? "Guardando…" : "Guardar prospecto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
