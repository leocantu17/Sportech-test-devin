"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Spinner } from "./Spinner";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function logout() {
    setLoading(true);
    setError(false);
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      title={error ? "No se pudo cerrar sesión, intenta de nuevo" : undefined}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-1.5 text-sm font-medium transition disabled:opacity-60 ${
        error ? "border-brand text-brand" : "border-zinc-700 hover:border-brand hover:text-brand"
      }`}
    >
      {loading && <Spinner />}
      {error ? "Reintentar" : "Cerrar sesión"}
    </button>
  );
}
