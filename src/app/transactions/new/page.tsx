import Link from "next/link";
import { getAccountOptions, getCategories } from "@/lib/data";
import { createTransaction } from "@/lib/actions";
import { TransactionForm } from "@/components/TransactionForm";
import { Card, EmptyState, PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function NewTransactionPage() {
  const [accounts, categories] = await Promise.all([getAccountOptions(), getCategories()]);

  return (
    <div>
      <PageHeader title="Transaktion erfassen" />
      <Card className="max-w-lg">
        {accounts.length === 0 || categories.length === 0 ? (
          <EmptyState>
            Bitte lege zunächst{" "}
            {accounts.length === 0 && (
              <Link href="/accounts/new" className="underline">
                ein Konto
              </Link>
            )}
            {accounts.length === 0 && categories.length === 0 && " und "}
            {categories.length === 0 && (
              <Link href="/categories/new" className="underline">
                eine Kategorie
              </Link>
            )}{" "}
            an.
          </EmptyState>
        ) : (
          <TransactionForm
            action={createTransaction}
            accounts={accounts}
            categories={categories}
            submitLabel="Transaktion speichern"
          />
        )}
      </Card>
    </div>
  );
}
