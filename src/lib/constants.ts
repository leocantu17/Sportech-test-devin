export const LEAD_STATUSES = [
  "NUEVO",
  "CONTACTADO",
  "EN_REVISION",
  "APROBADO",
  "RECHAZADO",
] as const;

export type LeadStatusValue = (typeof LEAD_STATUSES)[number];

export const STATUS_LABELS: Record<LeadStatusValue, string> = {
  NUEVO: "Nuevo",
  CONTACTADO: "Contactado",
  EN_REVISION: "En revisión",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
};

export const STATUS_STYLES: Record<LeadStatusValue, string> = {
  NUEVO: "bg-sky-50 text-sky-700 ring-sky-600/20",
  CONTACTADO: "bg-amber-50 text-amber-700 ring-amber-600/20",
  EN_REVISION: "bg-violet-50 text-violet-700 ring-violet-600/20",
  APROBADO: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  RECHAZADO: "bg-red-50 text-red-700 ring-red-600/20",
};

export const MX_STATES = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
] as const;

export const BUSINESS_TYPES = [
  "Tienda deportiva",
  "Distribuidor mayorista",
  "Gimnasio / Club deportivo",
  "Escuela / Universidad",
  "E-commerce",
  "Otro",
] as const;

export const VOLUME_OPTIONS = [
  "Menos de 100 piezas/mes",
  "100 – 500 piezas/mes",
  "500 – 1,000 piezas/mes",
  "Más de 1,000 piezas/mes",
] as const;
