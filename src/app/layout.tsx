import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/shared/providers/AppProviders";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Portal de Clientes | Relatório Executivo",
  description:
    "Portal interativo para acompanhamento da esteira de entregas e da evolução do produto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${dmSans.variable} ${ibmPlexMono.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
