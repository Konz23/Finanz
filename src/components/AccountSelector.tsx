"use client";

import { useRouter } from "next/navigation";
import { ColorDot } from "@/components/ui";

type Account = { id: string; name: string; color: string };

export function AccountSelector({
  accounts,
  selectedId,
}: {
  accounts: Account[];
  selectedId?: string;
}) {
  const router = useRouter();
  const selected = accounts.find((a) => a.id === selectedId);

  return (
    <div
      className="relative inline-flex items-center gap-2 rounded-full border pl-3 pr-8 py-1.5 text-sm font-medium"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <ColorDot color={selected?.color ?? "var(--foreground-muted)"} />
      <select
        aria-label="Konto auswählen"
        value={selectedId ?? "all"}
        onChange={(e) => {
          const value = e.target.value;
          router.push(value === "all" ? "/" : `/?account=${value}`);
        }}
        className="absolute inset-0 cursor-pointer appearance-none px-3 py-1.5 pr-8 outline-none"
        style={{ color: "transparent", background: "transparent", border: "none", borderRadius: "9999px" }}
      >
        <option value="all">Alle Konten</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      <span className="pointer-events-none">{selected ? selected.name : "Alle Konten"}</span>
      <span className="pointer-events-none absolute right-3 text-xs" style={{ color: "var(--foreground-muted)" }}>
        ▾
      </span>
    </div>
  );
}
