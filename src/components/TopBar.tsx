import Link from "next/link";
import { Logo } from "./Logo";
import { LogoutButton } from "./LogoutButton";

export function TopBar({ user }: { user: { name: string; role: "ADMIN" | "SALES" } }) {
  return (
    <header className="sticky top-0 z-30 bg-ink text-white shadow">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/dashboard" aria-label="Ir al dashboard">
          <Logo className="text-lg" />
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right leading-tight">
            <p className="max-w-[9rem] truncate text-sm font-semibold sm:max-w-none">{user.name}</p>
            <p className="text-xs text-zinc-400">{user.role === "ADMIN" ? "Administrador" : "Ventas"}</p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
