import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAccountOptions, getCategories } from "@/lib/data";
import { updateTransaction } from "@/lib/actions";
import { TransactionForm } from "@/components/TransactionForm";
import { Card, PageHeader } from "@/components/ui";

export default async function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [transaction, accounts, categories] = await Promise.all([
    prisma.transaction.findUnique({ where: { id } }),
    getAccountOptions(),
    getCategories(),
  ]);
  if (!transaction) notFound();

  return (
    <div>
      <PageHeader title="Transaktion bearbeiten" />
      <Card className="max-w-lg">
        <TransactionForm
          action={updateTransaction.bind(null, transaction.id)}
          accounts={accounts}
          categories={categories}
          defaultValues={transaction}
          submitLabel="Änderungen speichern"
        />
      </Card>
    </div>
  );
}
