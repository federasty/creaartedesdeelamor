import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mangata | Atelier de Velas",
  description: "Artesanía en cera y luz. El reflejo de la luna en tu hogar.",
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
