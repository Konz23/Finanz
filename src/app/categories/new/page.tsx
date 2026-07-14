import { createCategory } from "@/lib/actions";
import { CategoryForm } from "@/components/CategoryForm";
import { Card, PageHeader } from "@/components/ui";

export default function NewCategoryPage() {
  return (
    <div>
      <PageHeader title="Kategorie anlegen" />
      <Card className="max-w-lg">
        <CategoryForm action={createCategory} submitLabel="Kategorie anlegen" />
      </Card>
    </div>
  );
}
