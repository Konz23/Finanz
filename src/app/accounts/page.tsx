import Link from "next/link";
import { getAccountsWithBalance } from "@/lib/data";
import { deleteAccount } from "@/lib/actions";
import { formatCurrency } from "@/lib/format";
import { Card, ColorDot, EmptyState, PageHeader, SecondaryLink } from "@/components/ui";
import { DeleteButton } from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const accounts = await getAccountsWithBalance();

  return (
    <div>
      <PageHeader
        title="Konten"
        description="Alle deine Konten und ihre aktuellen Salden."
        action={<SecondaryLink href="/accounts/new">+ Konto anlegen</SecondaryLink>}
      />

      {accounts.length === 0 ? (
        <EmptyState>Noch keine Konten vorhanden.</EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <Card key={account.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ColorDot color={account.color} size={12} />
                  <span className="font-medium">{account.name}</span>
                </div>
                <span className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                  {account.type}
                </span>
              </div>
              <div className="text-2xl font-semibold tabular-nums">{formatCurrency(account.balance)}</div>
              <div className="mt-1 flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--border)" }}>
                <Link href={`/accounts/${account.id}/edit`} className="text-sm underline" style={{ color: "var(--foreground-secondary)" }}>
                  Bearbeiten
                </Link>
                <DeleteButton
                  action={deleteAccount.bind(null, account.id)}
                  confirmText={`Konto „${account.name}“ inklusive aller Transaktionen wirklich löschen?`}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
