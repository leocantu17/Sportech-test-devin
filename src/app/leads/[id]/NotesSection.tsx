"use client";

import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { noteCreateSchema } from "@/lib/validations";
import { Alert } from "@/components/Alert";
import { Spinner } from "@/components/Spinner";

type NoteDTO = { id: string; content: string; createdAt: string; authorName: string };

export function NotesSection({ leadId, initialNotes, currentUserName }: { leadId: string; initialNotes: NoteDTO[]; currentUserName: string }) {
  const [notes, setNotes] = useState(initialNotes);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = noteCreateSchema.safeParse({ content });
    if (!parsed.success) {
      setError(parsed.error.flatten().fieldErrors.content?.[0] ?? "La nota no es válida");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { note } = await apiFetch<{ note: NoteDTO }>(`/api/leads/${leadId}/notes`, {
        method: "POST",
        body: JSON.stringify(parsed.data),
      });
      setNotes((prev) => [note, ...prev]);
      setContent("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar la nota");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold">Bitácora de seguimiento</h2>
        <span className="text-xs text-zinc-500">{notes.length} {notes.length === 1 ? "nota" : "notas"}</span>
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-2">
        <label htmlFor="note" className="sr-only">
          Nueva nota
        </label>
        <textarea
          id="note"
          rows={3}
          maxLength={2000}
          className="input resize-y"
          placeholder={`Agregar nota como ${currentUserName}…`}
          value={content}
          disabled={loading}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <Alert>{error}</Alert>}
        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={loading || !content.trim()}>
            {loading && <Spinner />}
            {loading ? "Guardando…" : "Agregar nota"}
          </button>
        </div>
      </form>

      {notes.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500">
          Aún no hay notas para este prospecto.
        </p>
      ) : (
        <ol className="relative mt-6 space-y-5 border-l-2 border-zinc-200 pl-5">
          {notes.map((note) => (
            <li key={note.id} className="relative">
              <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white bg-brand ring-1 ring-zinc-200" aria-hidden="true" />
              <div className="flex flex-wrap items-baseline gap-x-2 text-xs text-zinc-500">
                <span className="font-semibold text-zinc-800">{note.authorName}</span>
                <time dateTime={note.createdAt}>{formatDateTime(note.createdAt)}</time>
              </div>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm text-zinc-700">{note.content}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
