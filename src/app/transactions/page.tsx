import Link from "next/link";
import { getTransactions } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { deleteTransaction } from "@/lib/actions";
import { formatCurrency, formatDate } from "@/lib/format";
import { Card, ColorDot, EmptyState, PageHeader, SecondaryLink } from "@/components/ui";
import { DeleteButton } from "@/components/DeleteButton";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ accountId?: string; categoryId?: string; type?: string; month?: string; q?: string }>;
}) {
  const params = await searchParams;
  const [transactions, accounts, categories] = await Promise.all([
    getTransactions({
      accountId: params.accountId,
      categoryId: params.categoryId,
      type: params.type === "INCOME" || params.type === "EXPENSE" ? params.type : undefined,
      month: params.month,
      search: params.q,
    }),
    prisma.account.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const hasFilters = Object.values(params).some(Boolean);

  return (
    <div>
      <PageHeader
        title="Transaktionen"
        description="Alle erfassten Einnahmen und Ausgaben."
        action={<SecondaryLink href="/transactions/new">+ Transaktion erfassen</SecondaryLink>}
      />

      <Card className="mb-4">
        <form className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <input
            type="search"
            name="q"
            placeholder="Suche…"
            defaultValue={params.q}
            className="col-span-2 sm:col-span-1"
          />
          <select name="type" defaultValue={params.type ?? ""}>
            <option value="">Alle Arten</option>
            <option value="INCOME">Einnahme</option>
            <option value="EXPENSE">Ausgabe</option>
          </select>
          <select name="accountId" defaultValue={params.accountId ?? ""}>
            <option value="">Alle Konten</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <select name="categoryId" defaultValue={params.categoryId ?? ""}>
            <option value="">Alle Kategorien</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input type="month" name="month" defaultValue={params.month ?? ""} />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg border px-4 py-2 text-sm font-medium"
              style={{ borderColor: "var(--border)" }}
            >
              Filtern
            </button>
            {hasFilters && (
              <Link
                href="/transactions"
                className="flex items-center rounded-lg px-3 text-sm underline"
                style={{ color: "var(--foreground-secondary)" }}
              >
                Zurücksetzen
              </Link>
            )}
          </div>
        </form>
      </Card>

      {transactions.length === 0 ? (
        <EmptyState>Keine Transaktionen gefunden.</EmptyState>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
                <th className="px-4 py-3 font-medium" style={{ color: "var(--foreground-secondary)" }}>Datum</th>
                <th className="px-4 py-3 font-medium" style={{ color: "var(--foreground-secondary)" }}>Beschreibung</th>
                <th className="px-4 py-3 font-medium" style={{ color: "var(--foreground-secondary)" }}>Kategorie</th>
                <th className="px-4 py-3 font-medium" style={{ color: "var(--foreground-secondary)" }}>Konto</th>
                <th className="px-4 py-3 text-right font-medium" style={{ color: "var(--foreground-secondary)" }}>Betrag</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--foreground-secondary)" }}>
                    {formatDate(tx.date)}
                  </td>
                  <td className="px-4 py-3 font-medium">{tx.description}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <ColorDot color={tx.category.color} />
                      {tx.category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--foreground-secondary)" }}>{tx.account.name}</td>
                  <td
                    className="px-4 py-3 text-right tabular-nums font-medium whitespace-nowrap"
                    style={{ color: tx.type === "INCOME" ? "var(--good)" : "var(--critical)" }}
                  >
                    {tx.type === "INCOME" ? "+" : "−"}
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      href={`/transactions/${tx.id}/edit`}
                      className="mr-2 text-xs underline"
                      style={{ color: "var(--foreground-secondary)" }}
                    >
                      Bearbeiten
                    </Link>
                    <DeleteButton
                      action={deleteTransaction.bind(null, tx.id)}
                      confirmText={`Transaktion „${tx.description}“ wirklich löschen?`}
                      label="Löschen"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
