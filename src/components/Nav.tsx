"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Übersicht" },
  { href: "/transactions", label: "Transaktionen" },
  { href: "/accounts", label: "Konten" },
  { href: "/categories", label: "Kategorien" },
  { href: "/budgets", label: "Budgets" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1">
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            style={{
              background: active ? "var(--accent)" : "transparent",
              color: active ? "#ffffff" : "var(--foreground-secondary)",
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
