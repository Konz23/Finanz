import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCategory } from "@/lib/actions";
import { CategoryForm } from "@/components/CategoryForm";
import { Card, PageHeader } from "@/components/ui";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <PageHeader title="Kategorie bearbeiten" />
      <Card className="max-w-lg">
        <CategoryForm
          action={updateCategory.bind(null, category.id)}
          defaultValues={category}
          submitLabel="Änderungen speichern"
        />
      </Card>
    </div>
  );
}
