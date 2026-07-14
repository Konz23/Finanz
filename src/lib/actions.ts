"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function num(formData: FormData, key: string): number {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : 0;
}

// ---------- Accounts ----------

export async function createAccount(formData: FormData) {
  const name = str(formData, "name");
  if (!name) throw new Error("Name ist erforderlich.");

  await prisma.account.create({
    data: {
      name,
      type: str(formData, "type") || "Girokonto",
      color: str(formData, "color") || "#6366f1",
      startBalance: num(formData, "startBalance"),
    },
  });

  revalidatePath("/accounts");
  revalidatePath("/");
  redirect("/accounts");
}

export async function updateAccount(id: string, formData: FormData) {
  const name = str(formData, "name");
  if (!name) throw new Error("Name ist erforderlich.");

  await prisma.account.update({
    where: { id },
    data: {
      name,
      type: str(formData, "type") || "Girokonto",
      color: str(formData, "color") || "#6366f1",
      startBalance: num(formData, "startBalance"),
    },
  });

  revalidatePath("/accounts");
  revalidatePath("/");
  redirect("/accounts");
}

export async function deleteAccount(id: string) {
  await prisma.account.delete({ where: { id } });
  revalidatePath("/accounts");
  revalidatePath("/transactions");
  revalidatePath("/");
}

// ---------- Categories ----------

export async function createCategory(formData: FormData) {
  const name = str(formData, "name");
  if (!name) throw new Error("Name ist erforderlich.");
  const type = str(formData, "type") === "INCOME" ? "INCOME" : "EXPENSE";

  await prisma.category.create({
    data: {
      name,
      type,
      color: str(formData, "color") || "#6366f1",
      icon: str(formData, "icon") || "circle",
    },
  });

  revalidatePath("/categories");
  redirect("/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const name = str(formData, "name");
  if (!name) throw new Error("Name ist erforderlich.");
  const type = str(formData, "type") === "INCOME" ? "INCOME" : "EXPENSE";

  await prisma.category.update({
    where: { id },
    data: {
      name,
      type,
      color: str(formData, "color") || "#6366f1",
      icon: str(formData, "icon") || "circle",
    },
  });

  revalidatePath("/categories");
  redirect("/categories");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/categories");
  revalidatePath("/budgets");
}

// ---------- Transactions ----------

export async function createTransaction(formData: FormData) {
  const description = str(formData, "description");
  const dateValue = str(formData, "date");
  const accountId = str(formData, "accountId");
  const categoryId = str(formData, "categoryId");
  const type = str(formData, "type") === "INCOME" ? "INCOME" : "EXPENSE";
  const amount = Math.abs(num(formData, "amount"));

  if (!description || !dateValue || !accountId || !categoryId || amount <= 0) {
    throw new Error("Bitte alle Pflichtfelder ausfüllen.");
  }

  await prisma.transaction.create({
    data: {
      description,
      date: new Date(dateValue),
      accountId,
      categoryId,
      type,
      amount,
    },
  });

  revalidatePath("/transactions");
  revalidatePath("/accounts");
  revalidatePath("/budgets");
  revalidatePath("/");
  redirect("/transactions");
}

export async function updateTransaction(id: string, formData: FormData) {
  const description = str(formData, "description");
  const dateValue = str(formData, "date");
  const accountId = str(formData, "accountId");
  const categoryId = str(formData, "categoryId");
  const type = str(formData, "type") === "INCOME" ? "INCOME" : "EXPENSE";
  const amount = Math.abs(num(formData, "amount"));

  if (!description || !dateValue || !accountId || !categoryId || amount <= 0) {
    throw new Error("Bitte alle Pflichtfelder ausfüllen.");
  }

  await prisma.transaction.update({
    where: { id },
    data: {
      description,
      date: new Date(dateValue),
      accountId,
      categoryId,
      type,
      amount,
    },
  });

  revalidatePath("/transactions");
  revalidatePath("/accounts");
  revalidatePath("/budgets");
  revalidatePath("/");
  redirect("/transactions");
}

export async function deleteTransaction(id: string) {
  await prisma.transaction.delete({ where: { id } });
  revalidatePath("/transactions");
  revalidatePath("/accounts");
  revalidatePath("/budgets");
  revalidatePath("/");
}

// ---------- Budgets ----------

export async function upsertBudget(formData: FormData) {
  const categoryId = str(formData, "categoryId");
  const month = str(formData, "month");
  const amount = num(formData, "amount");

  if (!categoryId || !month || amount <= 0) {
    throw new Error("Bitte alle Pflichtfelder ausfüllen.");
  }

  await prisma.budget.upsert({
    where: { categoryId_month: { categoryId, month } },
    update: { amount },
    create: { categoryId, month, amount },
  });

  revalidatePath("/budgets");
}

export async function deleteBudget(id: string) {
  await prisma.budget.delete({ where: { id } });
  revalidatePath("/budgets");
}
