import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const databaseUrl = (process.env.DATABASE_URL ?? "file:./dev.db").replace(/^file:/, "");
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

function monthsAgo(n: number, day = 1) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - n);
  d.setDate(day);
  return d;
}

async function main() {
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();

  const giro = await prisma.account.create({
    data: { name: "Girokonto", type: "Girokonto", color: "#6366f1", startBalance: 1500 },
  });
  const spar = await prisma.account.create({
    data: { name: "Sparkonto", type: "Sparkonto", color: "#10b981", startBalance: 5000 },
  });
  const bar = await prisma.account.create({
    data: { name: "Bargeld", type: "Bar", color: "#f59e0b", startBalance: 120 },
  });

  const [gehalt, freelance, zinsen, miete, lebensmittel, transport, freizeit, versicherung, sonstiges] =
    await Promise.all([
      prisma.category.create({ data: { name: "Gehalt", type: "INCOME", color: "#22c55e", icon: "wallet" } }),
      prisma.category.create({ data: { name: "Freelance", type: "INCOME", color: "#14b8a6", icon: "briefcase" } }),
      prisma.category.create({ data: { name: "Zinsen", type: "INCOME", color: "#06b6d4", icon: "trending-up" } }),
      prisma.category.create({ data: { name: "Miete", type: "EXPENSE", color: "#ef4444", icon: "home" } }),
      prisma.category.create({ data: { name: "Lebensmittel", type: "EXPENSE", color: "#f97316", icon: "shopping-cart" } }),
      prisma.category.create({ data: { name: "Transport", type: "EXPENSE", color: "#3b82f6", icon: "car" } }),
      prisma.category.create({ data: { name: "Freizeit", type: "EXPENSE", color: "#a855f7", icon: "smile" } }),
      prisma.category.create({ data: { name: "Versicherung", type: "EXPENSE", color: "#64748b", icon: "shield" } }),
      prisma.category.create({ data: { name: "Sonstiges", type: "EXPENSE", color: "#eab308", icon: "more-horizontal" } }),
    ]);

  const txs: { amount: number; type: "INCOME" | "EXPENSE"; description: string; date: Date; accountId: string; categoryId: string }[] = [];

  for (let m = 5; m >= 0; m--) {
    txs.push({ amount: 3200, type: "INCOME", description: "Gehalt", date: monthsAgo(m, 1), accountId: giro.id, categoryId: gehalt.id });
    txs.push({ amount: 950, type: "EXPENSE", description: "Miete", date: monthsAgo(m, 3), accountId: giro.id, categoryId: miete.id });
    txs.push({ amount: 320 + Math.round(Math.random() * 80), type: "EXPENSE", description: "Supermarkt", date: monthsAgo(m, 6), accountId: giro.id, categoryId: lebensmittel.id });
    txs.push({ amount: 65, type: "EXPENSE", description: "Deutschlandticket", date: monthsAgo(m, 2), accountId: giro.id, categoryId: transport.id });
    txs.push({ amount: 120 + Math.round(Math.random() * 100), type: "EXPENSE", description: "Kino & Restaurant", date: monthsAgo(m, 15), accountId: bar.id, categoryId: freizeit.id });
    txs.push({ amount: 45, type: "EXPENSE", description: "Haftpflichtversicherung", date: monthsAgo(m, 10), accountId: giro.id, categoryId: versicherung.id });
    if (m % 2 === 0) {
      txs.push({ amount: 400, type: "INCOME", description: "Freelance-Projekt", date: monthsAgo(m, 20), accountId: giro.id, categoryId: freelance.id });
    }
    if (m % 3 === 0) {
      txs.push({ amount: 12, type: "INCOME", description: "Sparzinsen", date: monthsAgo(m, 28), accountId: spar.id, categoryId: zinsen.id });
    }
    txs.push({ amount: 30 + Math.round(Math.random() * 40), type: "EXPENSE", description: "Sonstige Ausgaben", date: monthsAgo(m, 25), accountId: bar.id, categoryId: sonstiges.id });
  }

  await prisma.transaction.createMany({ data: txs });

  const currentMonth = new Date().toISOString().slice(0, 7);
  await prisma.budget.createMany({
    data: [
      { categoryId: lebensmittel.id, month: currentMonth, amount: 400 },
      { categoryId: freizeit.id, month: currentMonth, amount: 200 },
      { categoryId: transport.id, month: currentMonth, amount: 80 },
      { categoryId: sonstiges.id, month: currentMonth, amount: 100 },
    ],
  });

  console.log("Seed abgeschlossen.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
