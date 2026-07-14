"use client";

import { useTransition } from "react";

export function DeleteButton({
  action,
  confirmText,
  label = "Löschen",
}: {
  action: () => Promise<void>;
  confirmText: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmText)) {
          startTransition(async () => {
            try {
              await action();
            } catch {
              window.alert(
                "Löschen nicht möglich. Vermutlich sind noch Transaktionen oder Budgets damit verknüpft.",
              );
            }
          });
        }
      }}
      className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50"
      style={{ color: "var(--critical)" }}
    >
      {pending ? "…" : label}
    </button>
  );
}
