import { prisma } from "@/lib/prisma";
import { currentMonth } from "@/lib/format";

export async function getAccountsWithBalance() {
  const accounts = await prisma.account.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      transactions: { select: { amount: true, type: true } },
    },
  });

  return accounts.map((account) => {
    const delta = account.transactions.reduce(
      (sum, t) => sum + (t.type === "INCOME" ? t.amount : -t.amount),
      0,
    );
    return {
      id: account.id,
      name: account.name,
      type: account.type,
      color: account.color,
      startBalance: account.startBalance,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      balance: account.startBalance + delta,
    };
  });
}

export async function getAccountOptions() {
  return prisma.account.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, color: true },
  });
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: [{ type: "asc" }, { name: "asc" }] });
}

export async function getTotalBalance() {
  const accounts = await getAccountsWithBalance();
  return accounts.reduce((sum, a) => sum + a.balance, 0);
}

type TransactionFilters = {
  accountId?: string;
  categoryId?: string;
  type?: "INCOME" | "EXPENSE";
  month?: string;
  search?: string;
};

export async function getTransactions(filters: TransactionFilters = {}) {
  const { accountId, categoryId, type, month, search } = filters;

  let dateFilter: { gte: Date; lt: Date } | undefined;
  if (month) {
    const [year, m] = month.split("-").map(Number);
    dateFilter = {
      gte: new Date(year, m - 1, 1),
      lt: new Date(year, m, 1),
    };
  }

  return prisma.transaction.findMany({
    where: {
      accountId: accountId || undefined,
      categoryId: categoryId || undefined,
      type: type || undefined,
      date: dateFilter,
      description: search ? { contains: search } : undefined,
    },
    include: { account: true, category: true },
    orderBy: { date: "desc" },
  });
}

function monthKey(date: Date) {
  return date.toISOString().slice(0, 7);
}

export async function getDashboardData(accountId?: string) {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const nowMonth = currentMonth();

  const [allAccounts, transactions] = await Promise.all([
    getAccountsWithBalance(),
    prisma.transaction.findMany({
      where: { date: { gte: sixMonthsAgo }, accountId: accountId || undefined },
      include: { category: true },
      orderBy: { date: "desc" },
    }),
  ]);

  const accounts = accountId ? allAccounts.filter((a) => a.id === accountId) : allAccounts;
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const thisMonthTx = transactions.filter((t) => monthKey(t.date) === nowMonth);
  const incomeThisMonth = thisMonthTx
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenseThisMonth = thisMonthTx
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryBreakdown = new Map<
    string,
    { name: string; color: string; value: number }
  >();
  for (const t of thisMonthTx) {
    if (t.type !== "EXPENSE") continue;
    const entry = categoryBreakdown.get(t.categoryId) ?? {
      name: t.category.name,
      color: t.category.color,
      value: 0,
    };
    entry.value += t.amount;
    categoryBreakdown.set(t.categoryId, entry);
  }

  const monthlyTrend: { month: string; income: number; expense: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = monthKey(d);
    const monthTx = transactions.filter((t) => monthKey(t.date) === key);
    monthlyTrend.push({
      month: key,
      income: monthTx.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0),
      expense: monthTx.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0),
    });
  }

  const recentTransactions = transactions.slice(0, 6);

  return {
    totalBalance,
    accounts,
    incomeThisMonth,
    expenseThisMonth,
    categoryBreakdown: Array.from(categoryBreakdown.values()).sort((a, b) => b.value - a.value),
    monthlyTrend,
    recentTransactions,
  };
}

export async function getBudgetProgress(month: string = currentMonth()) {
  const [budgets, expenseTx] = await Promise.all([
    prisma.budget.findMany({
      where: { month },
      include: { category: true },
      orderBy: { category: { name: "asc" } },
    }),
    prisma.transaction.findMany({
      where: {
        type: "EXPENSE",
        date: {
          gte: new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 1, 1),
          lt: new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 1),
        },
      },
      select: { categoryId: true, amount: true },
    }),
  ]);

  const spentByCategory = new Map<string, number>();
  for (const t of expenseTx) {
    spentByCategory.set(t.categoryId, (spentByCategory.get(t.categoryId) ?? 0) + t.amount);
  }

  return budgets.map((b) => ({
    ...b,
    spent: spentByCategory.get(b.categoryId) ?? 0,
  }));
}
