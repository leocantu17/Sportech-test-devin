import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-brand">404</p>
      <h1 className="mt-2 text-2xl font-bold">Prospecto no encontrado</h1>
      <p className="mt-1 text-sm text-zinc-500">Es posible que haya sido eliminado o que el enlace sea incorrecto.</p>
      <Link href="/dashboard" className="btn-primary mt-6">
        Volver al dashboard
      </Link>
    </main>
  );
}
