import Link from "next/link";
import { getBudgetProgress } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { upsertBudget, deleteBudget } from "@/lib/actions";
import { currentMonth, formatCurrency, formatMonthLabel } from "@/lib/format";
import { Card, ColorDot, EmptyState, PageHeader, PrimaryButton } from "@/components/ui";
import { DeleteButton } from "@/components/DeleteButton";

function shiftMonth(month: string, delta: number) {
  const [year, m] = month.split("-").map(Number);
  const d = new Date(year, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function BudgetsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const month = monthParam || currentMonth();

  const [budgets, categories] = await Promise.all([
    getBudgetProgress(month),
    prisma.category.findMany({ where: { type: "EXPENSE" }, orderBy: { name: "asc" } }),
  ]);

  const budgetedCategoryIds = new Set(budgets.map((b) => b.categoryId));
  const availableCategories = categories.filter((c) => !budgetedCategoryIds.has(c.id));

  return (
    <div>
      <PageHeader
        title="Budgets"
        description="Setze dir monatliche Ausgabenlimits je Kategorie."
      />

      <div className="mb-4 flex items-center justify-center gap-3">
        <Link
          href={`/budgets?month=${shiftMonth(month, -1)}`}
          className="rounded-lg border px-3 py-1.5 text-sm"
          style={{ borderColor: "var(--border)" }}
        >
          ← Vormonat
        </Link>
        <span className="min-w-32 text-center text-sm font-medium">{formatMonthLabel(month)}</span>
        <Link
          href={`/budgets?month=${shiftMonth(month, 1)}`}
          className="rounded-lg border px-3 py-1.5 text-sm"
          style={{ borderColor: "var(--border)" }}
        >
          Folgemonat →
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {budgets.length === 0 ? (
          <EmptyState>Für diesen Monat sind noch keine Budgets gesetzt.</EmptyState>
        ) : (
          budgets.map((budget) => {
            const pct = Math.min(100, (budget.spent / budget.amount) * 100);
            const over = budget.spent > budget.amount;
            return (
              <Card key={budget.id}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <ColorDot color={budget.category.color} />
                    {budget.category.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm tabular-nums" style={{ color: over ? "var(--critical)" : "var(--foreground-secondary)" }}>
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                    </span>
                    <DeleteButton
                      action={deleteBudget.bind(null, budget.id)}
                      confirmText={`Budget für „${budget.category.name}“ löschen?`}
                    />
                  </div>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full" style={{ background: "var(--gridline)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: over ? "var(--critical)" : "var(--accent)" }}
                  />
                </div>
              </Card>
            );
          })
        )}
      </div>

      {availableCategories.length > 0 && (
        <Card className="mt-6 max-w-lg">
          <h2 className="mb-3 text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>
            Budget hinzufügen
          </h2>
          <form action={upsertBudget} className="flex items-end gap-3">
            <input type="hidden" name="month" value={month} />
            <div className="flex flex-1 flex-col gap-1.5">
              <label htmlFor="categoryId">Kategorie</label>
              <select id="categoryId" name="categoryId" required>
                {availableCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-32 flex-col gap-1.5">
              <label htmlFor="amount">Limit (€)</label>
              <input id="amount" name="amount" type="number" step="0.01" min="0.01" required />
            </div>
            <PrimaryButton type="submit">Hinzufügen</PrimaryButton>
          </form>
        </Card>
      )}
    </div>
  );
}
