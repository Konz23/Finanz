import { PrimaryButton } from "@/components/ui";

const ACCOUNT_TYPES = ["Girokonto", "Sparkonto", "Kreditkarte", "Bar", "Depot", "Sonstiges"];

export function AccountForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: { name: string; type: string; color: string; startBalance: number };
  submitLabel: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required defaultValue={defaultValues?.name} placeholder="z. B. Girokonto" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="type">Typ</label>
          <select id="type" name="type" defaultValue={defaultValues?.type ?? "Girokonto"}>
            {ACCOUNT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="color">Farbe</label>
          <input
            id="color"
            name="color"
            type="color"
            defaultValue={defaultValues?.color ?? "#2a78d6"}
            className="h-10 w-full p-1"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="startBalance">Startsaldo (€)</label>
        <input
          id="startBalance"
          name="startBalance"
          type="number"
          step="0.01"
          defaultValue={defaultValues?.startBalance ?? 0}
        />
      </div>

      <div className="mt-2">
        <PrimaryButton type="submit">{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
