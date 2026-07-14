import { createAccount } from "@/lib/actions";
import { AccountForm } from "@/components/AccountForm";
import { Card, PageHeader } from "@/components/ui";

export default function NewAccountPage() {
  return (
    <div>
      <PageHeader title="Konto anlegen" />
      <Card className="max-w-lg">
        <AccountForm action={createAccount} submitLabel="Konto anlegen" />
      </Card>
    </div>
  );
}
