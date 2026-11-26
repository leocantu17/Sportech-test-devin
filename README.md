# Sportech CRM · Distribuidores B2B (MVP)

Mini-CRM interno para recibir, filtrar y dar seguimiento a solicitudes de distribuidores B2B de Sportech.

**Stack:** Next.js 15 (App Router) + TypeScript · Tailwind CSS v4 · Prisma + PostgreSQL · Zod · sesión JWT (`jose`) en cookie HTTP-only · `bcryptjs`.

## Requisitos

- Node.js 20 o superior (probado con Node 22) y npm.
- PostgreSQL 14+ (local con Docker: `docker compose up -d`, o una base gratuita en [Neon](https://neon.tech)).

## Levantar el proyecto en local

```bash
# 1. Instalar dependencias (también genera el cliente de Prisma)
npm install

# 2. Variables de entorno
cp .env.example .env
#    Cambia AUTH_SECRET por un valor aleatorio de 32+ caracteres:  openssl rand -base64 32

# 3. Levantar PostgreSQL local (o pon en .env la URL de tu base) y aplicar migraciones
docker compose up -d
npx prisma migrate dev

# 4. Cargar datos de prueba (2 usuarios + 10 prospectos con notas)
npm run db:seed

# 5. Servidor de desarrollo
npm run dev
```

Abre http://localhost:3000 (redirige a `/login`).

### Credenciales demo

| Rol    | Correo                 | Contraseña   |
| ------ | ---------------------- | ------------ |
| ADMIN  | `admin@sportech.test`  | `Admin123!`  |
| SALES  | `ventas@sportech.test` | `Ventas123!` |

El recuadro con estas credenciales en `/login` solo se muestra cuando `DEMO_MODE="true"`.

### Otros scripts

| Script             | Descripción                                              |
| ------------------ | -------------------------------------------------------- |
| `npm run build`    | Build de producción (incluye chequeo de tipos y lint)    |
| `npm run start`    | Sirve el build de producción                             |
| `npm run lint`     | ESLint                                                   |
| `npm run db:deploy`| Aplica migraciones pendientes (producción)              |
| `npm run db:reset` | Borra la base, reaplica migraciones y vuelve a sembrar   |

## Variables de entorno

| Variable               | Descripción                                                             |
| ---------------------- | ----------------------------------------------------------------------- |
| `DATABASE_URL`         | Conexión PostgreSQL con pooling (la usa la app)                          |
| `DATABASE_URL_UNPOOLED`| Conexión PostgreSQL directa (la usan las migraciones)                    |
| `AUTH_SECRET`          | Secreto HS256 para firmar la cookie de sesión (mínimo 32 caracteres)     |
| `DEMO_MODE`            | `"true"` muestra las credenciales de prueba en `/login`                  |
| `LEADS_ALLOWED_ORIGIN` | Origen permitido (CORS) para `POST /api/leads`. `*` = cualquiera         |

## Funcionalidades

- **`/login`**: correo + contraseña; sesión en cookie `httpOnly`, `sameSite=lax` y `secure` en producción (8 h). El middleware protege `/dashboard` y `/leads/*`, y las páginas/endpoints privados verifican la sesión en el servidor.
- **`/dashboard`**: barra superior con usuario y cerrar sesión, 4 KPIs (total, nuevos, en revisión, aprobados), buscador por empresa/contacto, filtros por estatus y estado, vista **Tabla / Kanban** y modal **Nuevo prospecto**.
- **`/leads/[id]`**: detalle completo, selector de estatus que se guarda al instante y bitácora de notas asociadas al usuario autenticado.

## API

| Método | Ruta                      | Acceso  | Descripción                                           |
| ------ | ------------------------- | ------- | ----------------------------------------------------- |
| POST   | `/api/auth/login`         | Público | Inicia sesión y establece la cookie                    |
| POST   | `/api/auth/logout`        | Público | Elimina la cookie                                      |
| POST   | `/api/leads`              | Público | Ingesta de solicitudes (estatus inicial `NUEVO`)        |
| GET    | `/api/leads`              | Privado | Lista con filtros `q`, `status`, `stateZone` + KPIs     |
| PATCH  | `/api/leads/:id`          | Privado | Actualiza `status`                                     |
| POST   | `/api/leads/:id/notes`    | Privado | Agrega una nota con el usuario autenticado             |

### Ingesta desde la landing (`#solicitud`)

`POST /api/leads` acepta JSON o `application/x-www-form-urlencoded` / `multipart/form-data`, responde con CORS y valida con Zod. Cualquier `status` enviado se ignora: siempre se guarda como `NUEVO`.

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Deportes del Pacífico",
    "contactName": "Carlos Ruiz",
    "email": "carlos@deportespacifico.mx",
    "phone": "+52 669 123 4567",
    "stateZone": "Sinaloa",
    "businessType": "Tienda deportiva",
    "estimatedVolume": "100 – 500 piezas/mes"
  }'
```

- `201` → `{ "lead": { ... } }`
- `400` → `{ "error": "...", "fieldErrors": { "email": ["Correo inválido"] } }`

## Despliegue en Vercel

Vercel no conserva archivos entre peticiones, por eso el proyecto usa PostgreSQL (SQLite no sirve ahí).

1. **Importa el repo** en [vercel.com/new](https://vercel.com/new). Vercel detecta Next.js; no cambies los comandos de build.
2. **Crea la base de datos:** en el proyecto, *Storage → Create Database → Neon (Postgres)* y conéctala a todos los entornos. La integración crea `DATABASE_URL` y `DATABASE_URL_UNPOOLED`.
   - Si usas otra base PostgreSQL, define tú esas dos variables (pueden ser la misma URL si no hay pooler).
3. **Agrega las variables** en *Settings → Environment Variables*:

   | Variable               | Valor                                                                 |
   | ---------------------- | --------------------------------------------------------------------- |
   | `AUTH_SECRET`          | Resultado de `openssl rand -base64 32` (no uses el de `.env.example`) |
   | `DEMO_MODE`            | `"true"` solo si es un demo; en producción real omítela               |
   | `LEADS_ALLOWED_ORIGIN` | Dominio de la landing, p. ej. `https://www.sportech.mx`               |

4. **Deploy.** El script `vercel-build` corre `prisma generate && prisma migrate deploy && next build`, así que las migraciones se aplican solas en cada despliegue.
5. **Usuarios iniciales (una sola vez):** desde tu máquina, apuntando a la base de producción:

   ```bash
   DATABASE_URL="<url de Neon>" DATABASE_URL_UNPOOLED="<url directa de Neon>" npm run db:seed
   ```

   **Ojo:** el seed **borra todos los datos** antes de insertar los demo. Úsalo solo en una base vacía y cambia las contraseñas demo (o crea tus propios usuarios) si el sitio será público.

6. **Conecta la landing:** el formulario `#solicitud` debe enviar a `https://<tu-proyecto>.vercel.app/api/leads`.

> Pendiente antes de exponerlo públicamente: límite de intentos en `/api/auth/login` y protección anti-spam (captcha/rate limit) en `POST /api/leads`.

## Estructura

```
prisma/              schema, migraciones y seed
src/middleware.ts    protección de rutas privadas
src/lib/             prisma, sesión/auth, validaciones Zod, consultas y constantes
src/app/             páginas (login, dashboard, leads/[id]) y rutas API
src/components/      componentes compartidos (TopBar, StatusBadge, Spinner, …)
```
