import { z } from "zod";
import { LEAD_STATUSES } from "./constants";

z.setErrorMap((issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    return { message: issue.received === "undefined" ? "Este campo es obligatorio" : "Valor inválido" };
  }
  return { message: ctx.defaultError };
});

const trimmed = (min: number, max: number, label: string) =>
  z
    .string({ required_error: `${label} es obligatorio`, invalid_type_error: `${label} es inválido` })
    .trim()
    .min(min, `${label} debe tener al menos ${min} caracteres`)
    .max(max, `${label} debe tener máximo ${max} caracteres`);

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Correo inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const leadCreateSchema = z.object({
  companyName: trimmed(2, 120, "La empresa"),
  contactName: trimmed(2, 120, "El contacto"),
  email: z.string().trim().toLowerCase().email("Correo inválido"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]+$/, "Teléfono inválido")
    .refine((v) => /^\d{8,15}$/.test(v.replace(/\D/g, "")), "El teléfono debe tener entre 8 y 15 dígitos"),
  stateZone: trimmed(2, 60, "El estado/zona"),
  businessType: trimmed(2, 80, "El tipo de negocio"),
  estimatedVolume: trimmed(1, 80, "El volumen estimado"),
});

export const leadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES, { errorMap: () => ({ message: "Estatus inválido" }) }),
});

export const leadFiltersSchema = z.object({
  q: z.string().trim().max(100).optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  stateZone: z.string().trim().max(60).optional(),
});

export const noteCreateSchema = z.object({
  content: trimmed(1, 2000, "La nota"),
});

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;

export function fieldErrors(error: z.ZodError) {
  return error.flatten().fieldErrors as Record<string, string[] | undefined>;
}
