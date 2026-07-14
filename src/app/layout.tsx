import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Nav } from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finanzverwaltung",
  description: "Persönliche Finanzverwaltung – Konten, Transaktionen, Budgets im Überblick.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header
          className="sticky top-0 z-10 border-b backdrop-blur"
          style={{ background: "color-mix(in srgb, var(--surface) 92%, transparent)" }}
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              💶 Finanzverwaltung
            </Link>
            <Nav />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
        <footer
          className="border-t px-4 py-4 text-center text-xs sm:px-6"
          style={{ color: "var(--foreground-muted)" }}
        >
          Finanzverwaltung – lokale, persönliche Finanzübersicht.
        </footer>
      </body>
    </html>
  );
}
