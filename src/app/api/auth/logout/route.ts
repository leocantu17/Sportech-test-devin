import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

// Limpia solo sesiones inválidas o de usuarios que ya no existen (p. ej. tras db:reset) para evitar
// bucles de redirección; una sesión válida no se cierra por GET (evita logout cross-site).
export async function GET(request: Request) {
  if (await getCurrentUser()) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
  return response;
}

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
  return response;
}
