import "server-only";
import type { Lead, Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import type { LeadStatusValue } from "./constants";

export type LeadDTO = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  stateZone: string;
  businessType: string;
  estimatedVolume: string;
  status: LeadStatusValue;
  createdAt: string;
  updatedAt: string;
};

export type LeadStats = {
  total: number;
  nuevos: number;
  enRevision: number;
  aprobados: number;
  stateZones: string[];
};

export function toLeadDTO(lead: Lead): LeadDTO {
  return {
    ...lead,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  };
}

export async function listLeads(filters: { q?: string; status?: LeadStatusValue; stateZone?: string }) {
  const where: Prisma.LeadWhereInput = {};
  if (filters.q) {
    where.OR = [{ companyName: { contains: filters.q } }, { contactName: { contains: filters.q } }];
  }
  if (filters.status) where.status = filters.status;
  if (filters.stateZone) where.stateZone = filters.stateZone;

  const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: "desc" } });
  return leads.map(toLeadDTO);
}

export async function getLeadStats(): Promise<LeadStats> {
  const [total, grouped, zones] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.findMany({ distinct: ["stateZone"], select: { stateZone: true }, orderBy: { stateZone: "asc" } }),
  ]);
  const count = (s: LeadStatusValue) => grouped.find((g) => g.status === s)?._count._all ?? 0;
  return {
    total,
    nuevos: count("NUEVO"),
    enRevision: count("EN_REVISION"),
    aprobados: count("APROBADO"),
    stateZones: zones.map((z) => z.stateZone),
  };
}
