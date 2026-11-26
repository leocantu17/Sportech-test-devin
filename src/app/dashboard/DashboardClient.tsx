"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LeadDTO, LeadStats } from "@/lib/leads";
import { LEAD_STATUSES, STATUS_LABELS } from "@/lib/constants";
import { apiFetch, ApiError } from "@/lib/api";
import { Alert } from "@/components/Alert";
import { Spinner } from "@/components/Spinner";
import { KpiCards } from "./KpiCards";
import { LeadsTable } from "./LeadsTable";
import { KanbanBoard } from "./KanbanBoard";
import { NewLeadModal } from "./NewLeadModal";

type View = "table" | "kanban";
type Filters = { q: string; status: string; stateZone: string };

export function DashboardClient({ initialLeads, initialStats }: { initialLeads: LeadDTO[]; initialStats: LeadStats }) {
  const [leads, setLeads] = useState(initialLeads);
  const [stats, setStats] = useState(initialStats);
  const [filters, setFilters] = useState<Filters>({ q: "", status: "", stateZone: "" });
  const [view, setView] = useState<View>("table");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const requestId = useRef(0);
  const firstRender = useRef(true);

  const load = useCallback(async (current: Filters) => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(Object.entries(current).filter(([, v]) => v));
      const data = await apiFetch<{ leads: LeadDTO[]; stats: LeadStats }>(`/api/leads?${params}`);
      if (id !== requestId.current) return;
      setLeads(data.leads);
      setStats(data.stats);
    } catch (err) {
      if (id !== requestId.current) return;
      setError(err instanceof ApiError ? err.message : "No se pudieron cargar los prospectos");
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timeout = setTimeout(() => load(filters), 300);
    return () => clearTimeout(timeout);
  }, [filters, load]);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timeout);
  }, [toast]);

  const hasFilters = Boolean(filters.q || filters.status || filters.stateZone);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Solicitudes de distribuidores</h1>
          <p className="text-sm text-zinc-500">Recibe, filtra y da seguimiento a prospectos B2B.</p>
        </div>
        <button type="button" className="btn-primary" onClick={() => setModalOpen(true)}>
          <span aria-hidden="true" className="text-lg leading-none">+</span> Nuevo prospecto
        </button>
      </div>

      <KpiCards stats={stats} />

      <section className="card p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
          <label className="relative block">
            <span className="sr-only">Buscar por empresa o contacto</span>
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.45 4.39l3.08 3.08a.75.75 0 11-1.06 1.06l-3.08-3.08A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
            <input
              type="search"
              className="input pl-9"
              placeholder="Buscar empresa o contacto…"
              value={filters.q}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
            />
          </label>
          <select
            aria-label="Filtrar por estatus"
            className="input md:w-44"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="">Todos los estatus</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <select
            aria-label="Filtrar por estado"
            className="input md:w-48"
            value={filters.stateZone}
            onChange={(e) => setFilters((f) => ({ ...f, stateZone: e.target.value }))}
          >
            <option value="">Todos los estados</option>
            {stats.stateZones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
          <div role="tablist" aria-label="Vista" className="inline-flex rounded-lg border border-zinc-300 bg-zinc-100 p-1">
            {(["table", "kanban"] as const).map((v) => (
              <button
                key={v}
                role="tab"
                type="button"
                aria-selected={view === v}
                onClick={() => setView(v)}
                className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  view === v ? "bg-ink text-white shadow" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {v === "table" ? "Tabla" : "Kanban"}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex min-h-5 items-center justify-between text-xs text-zinc-500">
          <span className="inline-flex items-center gap-2">
            {loading ? (
              <>
                <Spinner className="h-3 w-3" /> Actualizando…
              </>
            ) : (
              `${leads.length} ${leads.length === 1 ? "resultado" : "resultados"}`
            )}
          </span>
          {hasFilters && (
            <button type="button" className="font-medium text-brand hover:underline" onClick={() => setFilters({ q: "", status: "", stateZone: "" })}>
              Limpiar filtros
            </button>
          )}
        </div>
      </section>

      {error && <Alert onRetry={() => load(filters)}>{error}</Alert>}

      <div className={`transition-opacity ${loading ? "opacity-60" : ""}`}>
        {leads.length === 0 && !loading ? (
          <div className="card px-6 py-16 text-center">
            <p className="font-semibold">No hay prospectos que coincidan</p>
            <p className="mt-1 text-sm text-zinc-500">
              {hasFilters ? "Prueba con otros filtros o limpia la búsqueda." : "Registra el primero con el botón “Nuevo prospecto”."}
            </p>
          </div>
        ) : view === "table" ? (
          <LeadsTable leads={leads} />
        ) : (
          <KanbanBoard leads={leads} />
        )}
      </div>

      <NewLeadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(lead) => {
          setModalOpen(false);
          setToast(`Prospecto “${lead.companyName}” creado`);
          load(filters);
        }}
      />

      {toast && (
        <div role="status" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-ink px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
