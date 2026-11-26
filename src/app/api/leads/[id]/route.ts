import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { toLeadDTO } from "@/lib/leads";
import { leadStatusSchema } from "@/lib/validations";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const parsed = leadStatusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Estatus inválido" }, { status: 400 });
  }

  const exists = await prisma.lead.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "Prospecto no encontrado" }, { status: 404 });

  const lead = await prisma.lead.update({ where: { id }, data: { status: parsed.data.status } });
  return NextResponse.json({ lead: toLeadDTO(lead) });
}
