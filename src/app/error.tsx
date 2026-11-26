"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold">Algo salió mal</h1>
      <p className="mt-1 text-sm text-zinc-500">No pudimos cargar esta página. Intenta de nuevo en unos segundos.</p>
      <button type="button" onClick={reset} className="btn-primary mt-6">
        Reintentar
      </button>
    </main>
  );
}
