import Link from "next/link";
import { getAccountOptions, getDashboardData } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";
import { Card, ColorDot, EmptyState, PageHeader, StatTile } from "@/components/ui";
import { MonthlyTrendChart } from "@/components/MonthlyTrendChart";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { AccountSelector } from "@/components/AccountSelector";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ account?: string }>;
}) {
  const { account: accountId } = await searchParams;
  const [accountOptions, data] = await Promise.all([
    getAccountOptions(),
    getDashboardData(accountId),
  ]);
  const selectedAccount = accountOptions.find((a) => a.id === accountId);
  const savings = data.incomeThisMonth - data.expenseThisMonth;

  return (
    <div>
      {accountOptions.length > 0 && (
        <div className="mb-3">
          <AccountSelector accounts={accountOptions} selectedId={accountId} />
        </div>
      )}
      <PageHeader
        title="Übersicht"
        description={
          selectedAccount
            ? `Saldo und Bewegungen für „${selectedAccount.name}“.`
            : "Dein Vermögen und deine Ein- und Ausgaben im Blick."
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          label={selectedAccount ? "Saldo" : "Gesamtvermögen"}
          value={formatCurrency(data.totalBalance)}
        />
        <StatTile label="Einnahmen diesen Monat" value={formatCurrency(data.incomeThisMonth)} tone="good" />
        <StatTile label="Ausgaben diesen Monat" value={formatCurrency(data.expenseThisMonth)} tone="critical" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>
            Einnahmen &amp; Ausgaben – letzte 6 Monate
          </h2>
          <MonthlyTrendChart data={data.monthlyTrend} />
          <div className="mt-4 border-t pt-3 text-sm" style={{ borderColor: "var(--border)" }}>
            Saldo diesen Monat:{" "}
            <span className="font-medium" style={{ color: savings >= 0 ? "var(--good)" : "var(--critical)" }}>
              {formatCurrency(savings)}
            </span>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>
            {selectedAccount ? "Konto" : "Konten"}
          </h2>
          <div className="flex flex-col gap-3">
            {data.accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ColorDot color={account.color} />
                  <span>{account.name}</span>
                </div>
                <span className="tabular-nums font-medium">{formatCurrency(account.balance)}</span>
              </div>
            ))}
            {data.accounts.length === 0 && (
              <EmptyState>
                Noch keine Konten.{" "}
                <Link href="/accounts/new" className="underline">
                  Konto anlegen
                </Link>
              </EmptyState>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>
            Ausgaben nach Kategorie – dieser Monat
          </h2>
          {data.categoryBreakdown.length > 0 ? (
            <CategoryBreakdown entries={data.categoryBreakdown} />
          ) : (
            <EmptyState>Noch keine Ausgaben in diesem Monat erfasst.</EmptyState>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>
              Letzte Transaktionen
            </h2>
            <Link href="/transactions" className="text-xs underline" style={{ color: "var(--foreground-secondary)" }}>
              Alle
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {data.recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between gap-2 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-medium">{tx.description}</div>
                  <div className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                    {formatDate(tx.date)} · {tx.category.name}
                  </div>
                </div>
                <span
                  className="shrink-0 tabular-nums font-medium"
                  style={{ color: tx.type === "INCOME" ? "var(--good)" : "var(--critical)" }}
                >
                  {tx.type === "INCOME" ? "+" : "−"}
                  {formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
            {data.recentTransactions.length === 0 && (
              <EmptyState>
                Noch keine Transaktionen.{" "}
                <Link href="/transactions/new" className="underline">
                  Transaktion erfassen
                </Link>
              </EmptyState>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
