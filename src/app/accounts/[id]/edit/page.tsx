import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateAccount } from "@/lib/actions";
import { AccountForm } from "@/components/AccountForm";
import { Card, PageHeader } from "@/components/ui";

export default async function EditAccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const account = await prisma.account.findUnique({ where: { id } });
  if (!account) notFound();

  return (
    <div>
      <PageHeader title="Konto bearbeiten" />
      <Card className="max-w-lg">
        <AccountForm
          action={updateAccount.bind(null, account.id)}
          defaultValues={account}
          submitLabel="Änderungen speichern"
        />
      </Card>
    </div>
  );
}
