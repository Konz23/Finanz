import Link from "next/link";
import { getCategories } from "@/lib/data";
import { deleteCategory } from "@/lib/actions";
import { Card, ColorDot, EmptyState, PageHeader, SecondaryLink } from "@/components/ui";
import { DeleteButton } from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategories();
  const income = categories.filter((c) => c.type === "INCOME");
  const expense = categories.filter((c) => c.type === "EXPENSE");

  return (
    <div>
      <PageHeader
        title="Kategorien"
        description="Ordne Transaktionen Kategorien zu, um Auswertungen und Budgets zu ermöglichen."
        action={<SecondaryLink href="/categories/new">+ Kategorie anlegen</SecondaryLink>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>
            Einnahmen
          </h2>
          {income.length === 0 ? (
            <EmptyState>Keine Einnahmen-Kategorien.</EmptyState>
          ) : (
            <ul className="flex flex-col gap-2">
              {income.map((c) => (
                <CategoryRow key={c.id} category={c} />
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <h2 className="mb-3 text-sm font-medium" style={{ color: "var(--foreground-secondary)" }}>
            Ausgaben
          </h2>
          {expense.length === 0 ? (
            <EmptyState>Keine Ausgaben-Kategorien.</EmptyState>
          ) : (
            <ul className="flex flex-col gap-2">
              {expense.map((c) => (
                <CategoryRow key={c.id} category={c} />
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function CategoryRow({ category }: { category: { id: string; name: string; color: string } }) {
  return (
    <li className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm" style={{ background: "var(--surface-hover)" }}>
      <div className="flex items-center gap-2">
        <ColorDot color={category.color} />
        <span>{category.name}</span>
      </div>
      <div className="flex items-center gap-3">
        <Link href={`/categories/${category.id}/edit`} className="underline" style={{ color: "var(--foreground-secondary)" }}>
          Bearbeiten
        </Link>
        <DeleteButton
          action={deleteCategory.bind(null, category.id)}
          confirmText={`Kategorie „${category.name}“ wirklich löschen? Das ist nur möglich, wenn ihr keine Transaktionen oder Budgets mehr zugeordnet sind.`}
        />
      </div>
    </li>
  );
}
