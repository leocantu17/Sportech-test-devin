"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { loginSchema } from "@/lib/validations";
import { Alert } from "@/components/Alert";
import { Spinner } from "@/components/Spinner";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse(Object.fromEntries(form));
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(parsed.data) });
      router.replace(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo iniciar sesión");
      if (err instanceof ApiError && err.fieldErrors) setFieldErrors(err.fieldErrors);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
      {error && <Alert>{error}</Alert>}
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-700">
          Correo
        </label>
        <input id="email" name="email" type="email" autoComplete="email" className="input" disabled={loading} required />
        {fieldErrors.email && <p className="mt-1 text-xs text-brand">{fieldErrors.email[0]}</p>}
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-700">
          Contraseña
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" className="input" disabled={loading} required />
        {fieldErrors.password && <p className="mt-1 text-xs text-brand">{fieldErrors.password[0]}</p>}
      </div>
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading && <Spinner />}
        {loading ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
