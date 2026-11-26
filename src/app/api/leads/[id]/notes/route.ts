import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { fieldErrors, noteCreateSchema } from "@/lib/validations";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const parsed = noteCreateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "La nota no es válida", fieldErrors: fieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  const lead = await prisma.lead.findUnique({ where: { id }, select: { id: true } });
  if (!lead) return NextResponse.json({ error: "Prospecto no encontrado" }, { status: 404 });

  const note = await prisma.note.create({
    data: { leadId: id, authorId: user.id, content: parsed.data.content },
    include: { author: { select: { name: true } } },
  });

  return NextResponse.json(
    {
      note: {
        id: note.id,
        content: note.content,
        createdAt: note.createdAt.toISOString(),
        authorName: note.author.name,
      },
    },
    { status: 201 },
  );
}
