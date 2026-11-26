# SPEC — Mini-CRM B2B Distribuidores Sportech (MVP)

## 1. Objetivo
Construir un MVP funcional (rebanada vertical) de un CRM interno para recibir, filtrar y dar seguimiento a solicitudes de distribuidores B2B de Sportech.

## 2. Stack Obligatorio
- Framework: Next.js (App Router) + TypeScript
- Estilos: Tailwind CSS
- Base de datos y ORM: Prisma con SQLite local (listo para migrar a PostgreSQL en producción)
- Validación: Zod en formularios y endpoints API

## 3. Modelo de Datos
- **User:** `id`, `name`, `email` (único), `passwordHash`, `role` (`ADMIN` | `SALES`), `createdAt`.
- **Lead:** `id`, `companyName`, `contactName`, `email`, `phone`, `stateZone`, `businessType`, `estimatedVolume`, `status` (`NUEVO`, `CONTACTADO`, `EN_REVISION`, `APROBADO`, `RECHAZADO`), `createdAt`, `updatedAt`.
- **Note:** `id`, `leadId` (relación con Lead), `authorId` (relación con User), `content`, `createdAt`.

## 4. Pantallas y Funcionalidades
1. **`/login`:** Inicio de sesión con correo y contraseña, sesión mediante cookie HTTP-only segura y protección de todas las rutas privadas mediante middleware/servidor. Mostrar credenciales de prueba en un recuadro discreto solo para entorno demo.
2. **`/dashboard`:**
   - Barra superior con nombre del usuario logueado y botón de cerrar sesión.
   - 4 tarjetas KPI: Total de solicitudes, Nuevos, En revisión y Aprobados.
   - Buscador por empresa/contacto y filtros por `status` y `stateZone`.
   - Selector de vista **Tabla / Kanban** (columnas por `status`) y botón **"Nuevo prospecto"** con modal de alta manual.
3. **`/leads/[id]`:**
   - Vista de detalle completa del prospecto.
   - Selector para actualizar el `status` en tiempo real (persistido en base de datos).
   - Bitácora cronológica de notas internas con formulario para agregar nuevas notas asociadas al usuario autenticado.
4. **Endpoint público de ingesta (`POST /api/leads`):**
   - Recibe solicitudes externas (pensado para conectarse al formulario `#solicitud` de la landing B2B), valida payload con Zod y guarda el lead con estatus inicial `NUEVO`.

## 5. Datos de Prueba (Seed)
- Incluir script `prisma/seed.ts` que cree:
  - 2 usuarios (`admin@sportech.test` y `ventas@sportech.test`).
  - 10 prospectos B2B realistas en distintos estados de México distribuidos en los 5 estatus, con al menos 1–2 notas de seguimiento en varios de ellos.

## 6. Criterios de Terminado
- `npm run build` limpio sin errores de TypeScript.
- Archivo `README.md` con los pasos exactos para levantar el proyecto en local (`install`, `prisma migrate`, `seed`, `dev`).
- Interfaz limpia con paleta Sportech (oscuro/blanco/acento rojo) y usable en móvil y escritorio.
- Manejo claro de errores y estados de carga en todas las acciones de red.