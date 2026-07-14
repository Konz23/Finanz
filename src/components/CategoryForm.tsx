import { PrimaryButton } from "@/components/ui";

export function CategoryForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: { name: string; type: "INCOME" | "EXPENSE"; color: string };
  submitLabel: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required defaultValue={defaultValues?.name} placeholder="z. B. Lebensmittel" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="type">Art</label>
          <select id="type" name="type" defaultValue={defaultValues?.type ?? "EXPENSE"}>
            <option value="EXPENSE">Ausgabe</option>
            <option value="INCOME">Einnahme</option>
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

      <div className="mt-2">
        <PrimaryButton type="submit">{submitLabel}</PrimaryButton>
      </div>
    </form>
  );
}
