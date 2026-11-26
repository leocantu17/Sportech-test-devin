import { Logo } from "@/components/Logo";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const { from } = await searchParams;
  const showDemo = process.env.DEMO_MODE === "true";
  const redirectTo = from && /^\/(?!\/)/.test(from) && !/[\\\u0000-\u001f]/.test(from) ? from : "/dashboard";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center text-white">
          <Logo className="text-2xl" />
          <p className="mt-3 text-sm text-zinc-400">CRM de distribuidores B2B</p>
        </div>
        <div className="card p-6 sm:p-8">
          <h1 className="text-xl font-bold">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-zinc-500">Ingresa con tu cuenta corporativa.</p>
          <LoginForm redirectTo={redirectTo} />
        </div>
        {showDemo && (
          <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-xs text-zinc-400">
            <p className="mb-1 font-semibold uppercase tracking-wide text-zinc-500">Credenciales demo</p>
            <p>
              <span className="font-mono text-zinc-300">admin@sportech.test</span> / <span className="font-mono text-zinc-300">Admin123!</span>
            </p>
            <p>
              <span className="font-mono text-zinc-300">ventas@sportech.test</span> / <span className="font-mono text-zinc-300">Ventas123!</span>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
