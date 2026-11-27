import { execSync } from "node:child_process";

// Try loading local .env if running locally and process.loadEnvFile is available
try {
  if (typeof process.loadEnvFile === "function") {
    process.loadEnvFile();
  }
} catch {
  // Ignore if .env is missing or invalid
}

// If DATABASE_URL is set but DATABASE_URL_UNPOOLED is missing, fallback to DATABASE_URL
if (process.env.DATABASE_URL && !process.env.DATABASE_URL_UNPOOLED) {
  process.env.DATABASE_URL_UNPOOLED = process.env.DATABASE_URL;
}

// If neither is set (e.g. preview builds without database configured yet), provide placeholders
// so prisma generate can inspect the schema without throwing P1012
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://dummy:dummy@localhost:5432/dummy";
}
if (!process.env.DATABASE_URL_UNPOOLED) {
  process.env.DATABASE_URL_UNPOOLED = process.env.DATABASE_URL;
}

console.log("==> Generating Prisma client...");
execSync("npx prisma generate", { stdio: "inherit", env: process.env });

// Only attempt migrations if a real database URL is configured
const isRealDatabase =
  process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes("localhost:5432/dummy");

if (isRealDatabase) {
  console.log("==> Running Prisma migrations (prisma migrate deploy)...");
  try {
    execSync("npx prisma migrate deploy", { stdio: "inherit", env: process.env });
    console.log("==> Migrations applied successfully.");
  } catch (err) {
    console.warn("==> Warning: prisma migrate deploy did not succeed during build:", err.message);
    console.warn("==> Continuing build. Verify database connectivity and credentials in Vercel settings.");
  }
} else {
  console.log("==> DATABASE_URL not configured for migration deploy; skipping.");
}

console.log("==> Building Next.js application...");
execSync("npx next build", { stdio: "inherit", env: process.env });
