import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crea Arte desde el Amor | Atelier de Velas",
  description: "Artesanía en cera y luz. Arte hecho desde el corazón.",
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
