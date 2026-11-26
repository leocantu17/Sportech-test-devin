import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getLeadStats, listLeads, toLeadDTO } from "@/lib/leads";
import { fieldErrors, leadCreateSchema, leadFiltersSchema } from "@/lib/validations";

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.LEADS_ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

async function readBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await request.formData().catch(() => null);
    return form ? Object.fromEntries(form.entries()) : null;
  }
  return request.json().catch(() => null);
}

// Endpoint público de ingesta (formulario #solicitud de la landing B2B).
export async function POST(request: Request) {
  const body = await readBody(request);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Cuerpo de la solicitud inválido" }, { status: 400, headers: corsHeaders });
  }

  const parsed = leadCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Revisa los datos del formulario", fieldErrors: fieldErrors(parsed.error) },
      { status: 400, headers: corsHeaders },
    );
  }

  try {
    const lead = await prisma.lead.create({ data: { ...parsed.data, status: "NUEVO" } });
    return NextResponse.json({ lead: toLeadDTO(lead) }, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error("Error al crear lead", error);
    return NextResponse.json({ error: "No se pudo guardar la solicitud" }, { status: 500, headers: corsHeaders });
  }
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const params = Object.fromEntries(
    [...new URL(request.url).searchParams.entries()].filter(([, value]) => value !== ""),
  );
  const parsed = leadFiltersSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Filtros inválidos" }, { status: 400 });
  }

  const [leads, stats] = await Promise.all([listLeads(parsed.data), getLeadStats()]);
  return NextResponse.json({ leads, stats });
}
