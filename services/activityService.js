import { startOfDay, endOfDay } from "date-fns";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

export async function getDailySales(date = new Date("2024-09-09")) {
  const sales = await prisma.saleMaster.findMany({
    where: {
      createdAt: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
    },
    select: {
      createdAt: true,
      total: true,
    },
  });

  const grouped = {};

  for (const sale of sales) {
    const hour = sale.createdAt.getHours();

    if (!grouped[hour]) {
      grouped[hour] = { total: 0, count: 0 };
    }

    grouped[hour].total += Number(sale.total);
    grouped[hour].count += 1;
  }

  const sortedHours = Object.keys(grouped)
    .map((h) => parseInt(h))
    .sort((a, b) => a - b);

  const formattedHours = sortedHours.map((h) => {
    const suffix = h < 12 ? "am" : "pm";
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12}${suffix}`;
  });

  const salesTotal = sortedHours.map((h) => grouped[h].total);
  const salesUnits = sortedHours.map((h) => grouped[h].count); // <-- aquí está la "quantity"

  return {
    hours: formattedHours,
    salesTotal,
    salesUnits,
  };
}

export async function getMonthlySales(date = new Date("2024-09-09")) {

  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const sales = await prisma.saleMaster.findMany({
    where: {
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    select: {
      total: true,
    },
  });

  const monthlySales = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
  const monthlyUnitsSaled = sales.length; 

  return { monthlySales, monthlyUnitsSaled };

}