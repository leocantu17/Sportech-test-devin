import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sportech CRM · Distribuidores B2B",
  description: "Mini-CRM interno para el seguimiento de solicitudes de distribuidores B2B de Sportech",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
