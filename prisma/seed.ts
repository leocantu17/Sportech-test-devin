import { PrismaClient, type LeadStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const daysAgo = (days: number, hours = 0) => new Date(Date.now() - (days * 24 + hours) * 60 * 60 * 1000);

type SeedLead = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  stateZone: string;
  businessType: string;
  estimatedVolume: string;
  status: LeadStatus;
  createdDaysAgo: number;
  notes: { author: "admin" | "ventas"; content: string; daysAgo: number }[];
};

const leads: SeedLead[] = [
  {
    companyName: "Deportes Cumbre Regia",
    contactName: "Mariana Garza Treviño",
    email: "mariana.garza@cumbreregia.mx",
    phone: "+52 81 8340 2215",
    stateZone: "Nuevo León",
    businessType: "Tienda deportiva",
    estimatedVolume: "100 – 500 piezas/mes",
    status: "NUEVO",
    createdDaysAgo: 1,
    notes: [],
  },
  {
    companyName: "Club Atlético Tapatío",
    contactName: "Jorge Luis Ramírez",
    email: "compras@clubtapatio.com.mx",
    phone: "+52 33 3615 7720",
    stateZone: "Jalisco",
    businessType: "Gimnasio / Club deportivo",
    estimatedVolume: "Menos de 100 piezas/mes",
    status: "NUEVO",
    createdDaysAgo: 2,
    notes: [{ author: "ventas", content: "Solicitud recibida desde la landing. Agendar llamada de presentación esta semana.", daysAgo: 1 }],
  },
  {
    companyName: "Distribuidora Deportiva del Bajío",
    contactName: "Fernanda López Arce",
    email: "flopez@ddbajio.mx",
    phone: "+52 477 712 4410",
    stateZone: "Guanajuato",
    businessType: "Distribuidor mayorista",
    estimatedVolume: "Más de 1,000 piezas/mes",
    status: "CONTACTADO",
    createdDaysAgo: 6,
    notes: [
      { author: "ventas", content: "Primera llamada realizada. Distribuyen a 40 tiendas en León, Celaya e Irapuato.", daysAgo: 5 },
      { author: "ventas", content: "Envié catálogo mayorista 2026 y lista de precios por volumen.", daysAgo: 4 },
    ],
  },
  {
    companyName: "FitZone Puebla",
    contactName: "Ricardo Hernández Sosa",
    email: "ricardo@fitzonepuebla.mx",
    phone: "+52 222 245 8890",
    stateZone: "Puebla",
    businessType: "Gimnasio / Club deportivo",
    estimatedVolume: "100 – 500 piezas/mes",
    status: "CONTACTADO",
    createdDaysAgo: 8,
    notes: [{ author: "admin", content: "Interesados en uniformes personalizados para staff de sus 6 sucursales.", daysAgo: 7 }],
  },
  {
    companyName: "Universidad del Mayab – Deportes",
    contactName: "Ana Sofía Canto",
    email: "deportes@unimayab.edu.mx",
    phone: "+52 999 942 4800",
    stateZone: "Yucatán",
    businessType: "Escuela / Universidad",
    estimatedVolume: "500 – 1,000 piezas/mes",
    status: "EN_REVISION",
    createdDaysAgo: 12,
    notes: [
      { author: "ventas", content: "Requieren uniformes para 8 equipos representativos. Piden muestras de tela.", daysAgo: 10 },
      { author: "admin", content: "Revisando condiciones de crédito a 60 días solicitadas por el área de compras.", daysAgo: 3 },
    ],
  },
  {
    companyName: "SportMarket Querétaro",
    contactName: "Diego Martínez Olvera",
    email: "diego@sportmarketqro.com",
    phone: "+52 442 215 3366",
    stateZone: "Querétaro",
    businessType: "E-commerce",
    estimatedVolume: "500 – 1,000 piezas/mes",
    status: "EN_REVISION",
    createdDaysAgo: 15,
    notes: [{ author: "ventas", content: "Validando su historial en marketplaces y política de precios mínimos (MAP).", daysAgo: 9 }],
  },
  {
    companyName: "Deportes Frontera Norte",
    contactName: "Luis Alberto Cázares",
    email: "lcazares@fronteranorte.mx",
    phone: "+52 664 634 1290",
    stateZone: "Baja California",
    businessType: "Distribuidor mayorista",
    estimatedVolume: "Más de 1,000 piezas/mes",
    status: "APROBADO",
    createdDaysAgo: 25,
    notes: [
      { author: "admin", content: "Contrato de distribución firmado para Tijuana, Mexicali y Ensenada.", daysAgo: 18 },
      { author: "ventas", content: "Primer pedido de 1,200 piezas confirmado. Entrega programada en 2 semanas.", daysAgo: 14 },
    ],
  },
  {
    companyName: "Atletika CDMX",
    contactName: "Valeria Domínguez Ruiz",
    email: "valeria@atletika.mx",
    phone: "+52 55 5520 4471",
    stateZone: "Ciudad de México",
    businessType: "Tienda deportiva",
    estimatedVolume: "100 – 500 piezas/mes",
    status: "APROBADO",
    createdDaysAgo: 30,
    notes: [{ author: "ventas", content: "Alta como distribuidor autorizado en zona Polanco y Coyoacán.", daysAgo: 20 }],
  },
  {
    companyName: "Equipos Deportivos Sierra",
    contactName: "Héctor Chávez Molina",
    email: "hchavez@edsierra.com.mx",
    phone: "+52 614 410 2387",
    stateZone: "Chihuahua",
    businessType: "Tienda deportiva",
    estimatedVolume: "Menos de 100 piezas/mes",
    status: "RECHAZADO",
    createdDaysAgo: 20,
    notes: [{ author: "admin", content: "No cumple volumen mínimo para distribuidor. Se sugiere compra vía tienda en línea.", daysAgo: 16 }],
  },
  {
    companyName: "Golfo Sports",
    contactName: "Paola Méndez Rivera",
    email: "paola.mendez@golfosports.mx",
    phone: "+52 229 931 5504",
    stateZone: "Veracruz",
    businessType: "Otro",
    estimatedVolume: "Menos de 100 piezas/mes",
    status: "RECHAZADO",
    createdDaysAgo: 18,
    notes: [],
  },
];

async function main() {
  await prisma.note.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();

  const [admin, ventas] = await Promise.all([
    prisma.user.create({
      data: { name: "Admin Sportech", email: "admin@sportech.test", passwordHash: await bcrypt.hash("Admin123!", 10), role: "ADMIN" },
    }),
    prisma.user.create({
      data: { name: "Laura Ventas", email: "ventas@sportech.test", passwordHash: await bcrypt.hash("Ventas123!", 10), role: "SALES" },
    }),
  ]);
  const authors = { admin: admin.id, ventas: ventas.id };

  for (const { notes, createdDaysAgo, ...lead } of leads) {
    const createdAt = daysAgo(createdDaysAgo);
    const lastNote = notes.length ? Math.min(...notes.map((n) => n.daysAgo)) : createdDaysAgo;
    await prisma.lead.create({
      data: {
        ...lead,
        createdAt,
        updatedAt: daysAgo(lastNote),
        notes: {
          create: notes.map((n, i) => ({ authorId: authors[n.author], content: n.content, createdAt: daysAgo(n.daysAgo, i) })),
        },
      },
    });
  }

  console.log(`Seed completado: 2 usuarios, ${leads.length} prospectos.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
