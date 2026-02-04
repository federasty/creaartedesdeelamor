import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "creaarte desde el amor | Panel Administrativo",
  description: "Sistema de gestión maestra para creaarte desde el amor.",
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
