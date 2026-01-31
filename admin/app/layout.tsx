import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mangata | Panel Administrativo",
  description: "Sistema de gestión maestra para el atelier Mangata.",
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
