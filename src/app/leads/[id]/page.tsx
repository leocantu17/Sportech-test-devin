import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toLeadDTO } from "@/lib/leads";
import { formatDateTime } from "@/lib/format";
import { TopBar } from "@/components/TopBar";
import { StatusSelect } from "./StatusSelect";
import { NotesSection } from "./NotesSection";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } } },
  });
  if (!lead) notFound();

  const dto = toLeadDTO(lead);
  const notes = lead.notes.map((n) => ({
    id: n.id,
    content: n.content,
    createdAt: n.createdAt.toISOString(),
    authorName: n.author.name,
  }));

  const details = [
    { label: "Contacto", value: dto.contactName },
    { label: "Correo", value: dto.email, href: `mailto:${dto.email}` },
    { label: "Teléfono", value: dto.phone, href: `tel:${dto.phone.replace(/[^\d+]/g, "")}` },
    { label: "Estado / zona", value: dto.stateZone },
    { label: "Tipo de negocio", value: dto.businessType },
    { label: "Volumen estimado", value: dto.estimatedVolume },
    { label: "Recibido", value: formatDateTime(dto.createdAt) },
    { label: "Última actualización", value: formatDateTime(dto.updatedAt) },
  ];

  return (
    <>
      <TopBar user={user} />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-brand">
          ← Volver al dashboard
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Prospecto B2B</p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{dto.companyName}</h1>
          </div>
          <StatusSelect leadId={dto.id} initialStatus={dto.status} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <section className="card p-5">
            <h2 className="text-base font-semibold">Información</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {details.map((d) => (
                <div key={d.label}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{d.label}</dt>
                  <dd className="mt-0.5 break-words text-sm">
                    {d.href ? (
                      <a href={d.href} className="text-zinc-900 underline decoration-zinc-300 hover:text-brand">
                        {d.value}
                      </a>
                    ) : (
                      d.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
          <NotesSection leadId={dto.id} initialNotes={notes} currentUserName={user.name} />
        </div>
      </main>
    </>
  );
}
