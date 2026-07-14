"use client";

import { useMemo, useState } from "react";
import { PrimaryButton } from "@/components/ui";
import { dateToInputValue } from "@/lib/format";

type Account = { id: string; name: string };
type Category = { id: string; name: string; type: "INCOME" | "EXPENSE" };

export function TransactionForm({
  action,
  accounts,
  categories,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  accounts: Account[];
  categories: Category[];
  defaultValues?: {
    description: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    date: Date | string;
    accountId: string;
    categoryId: string;
  };
  submitLabel: string;
}) {
  const [type, setType] = useState<"INCOME" | "EXPENSE">(defaultValues?.type ?? "EXPENSE");
  const filteredCategories = useMemo(() => categories.filter((c) => c.type === type), [categories, type]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label>Art</label>
        <div className="flex gap-2">
          {(["EXPENSE", "INCOME"] as const).map((t) => (
            <label
              key={t}
              className="flex flex-1 cursor-pointer items-center justify-center rounded-lg border py-2 text-sm font-medium"
              style={{
                borderColor: type === t ? "var(--accent)" : "var(--border)",
                background: type === t ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent",
                color: type === t ? "var(--accent)" : "var(--foreground)",
              }}
            >
              <input
                type="radio"
                name="type"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="sr-only"
              />
              {t === "EXPENSE" ? "Ausgabe" : "Einnahme"}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description">Beschreibung</label>
        <input
          id="description"
          name="description"
          required
          defaultValue={defaultValues?.description}
          placeholder="z. B. Supermarkt"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="amount">Betrag (€)</label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={defaultValues?.amount}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="date">Datum</label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={defaultValues ? dateToInputValue(defaultValues.date) : dateToInputValue(new Date())}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="accountId">Konto</label>
          <select id="accountId" name="accountId" required defaultValue={defaultValues?.accountId}>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="categoryId">Kategorie</label>
          <select id="categoryId" name="categoryId" required defaultValue={defaultValues?.categoryId}>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-2">
        <PrimaryButton type="submit">{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
