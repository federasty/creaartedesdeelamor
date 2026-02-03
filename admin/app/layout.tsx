import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crea Arte desde el Amor | Panel Administrativo",
  description: "Sistema de gestión maestra para Crea Arte desde el Amor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
