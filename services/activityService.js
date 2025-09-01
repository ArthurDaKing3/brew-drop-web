import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { getLocalDateString } from "@/utils/utilites.js"; 
import ExecuteSP from "./prismaService";

export async function getDailySales(prisma, tenant) {

  const sales = await ExecuteSP(prisma, "sp_GetDailySales", [tenant, getLocalDateString()], ['hour', 'total', 'quantity']);
  
  const hours = sales.map((sale) => {

    const hour = Number(sale.hour);
    const suffix = hour < 12 ? "am" : "pm";
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}${suffix}`;

  });

  const salesTotal = sales.map((sale) => sale.total);
  const salesUnits = sales.map((sale) => sale.quantity);

  return {
    hours,  
    salesTotal,
    salesUnits,
  };

}

export async function getMonthlySales(prisma, tenant) {

  const date       = new Date();
  const monthStart = getLocalDateString(startOfMonth(date));
  const monthEnd   = getLocalDateString(endOfMonth(date));

  const sales = await getSalesByMonth(prisma, tenant, monthStart, monthEnd);

  const monthlySales     = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
  const monthlyUnitsSold = sales.reduce((sum, sale) => sum + Number(sale.quantity), 0);
  const monthlySalesGoal = 10000; 
  const monthlyUnitsGoal = 500;

  return { monthlySales, monthlyUnitsSold, monthlySalesGoal, monthlyUnitsGoal};

}

export async function getSalesGrowth(prisma, tenant) {

  const now = new Date();
  const months = [];

  for (let i = 3; i >= 0; i--) {

    const date = subMonths(now, i);
    months.push({
      label: format(date, "MMMM"),
      start: startOfMonth(date),
      end: endOfMonth(date),
    });

  }

  const dates = [];
  const sales = [];
  const units = [];

  for (const month of months) {

    const result = await getSalesByMonth(prisma, tenant, getLocalDateString(month.start), getLocalDateString(month.end));

    const total = result.reduce((acc, sale) => acc + Number(sale.total), 0);
    const quantity = result.reduce((acc, sale) => acc + Number(sale.quantity), 0);

    dates.push(month.label);
    sales.push(total);
    units.push(quantity);
  }

  return {
    dates,
    sales,
    units,
  };

}

export async function getMonthlySalesByCategory(prisma, tenant){

  const sales = await ExecuteSP(prisma, "sp_GetMonthlySalesByCategory", [tenant], ['category', 'total', 'quantity']);

  const categories = sales.map((sale) => sale.category);
  const totalSales = sales.map((sale) => sale.total);
  const totalUnits = sales.map((sale) => sale.quantity);

  return {
      categories,
      totalSales,
      totalUnits,
  };

}

async function getSalesByMonth(prisma, tenant, startDate, endDate) {

  return await ExecuteSP(prisma, "sp_GetSalesByMonth", [tenant, startDate, endDate], ['month', 'total', 'quantity']);

}

export async function getTopProducts(prisma, tenant) {

  const result = await ExecuteSP(prisma, "sp_GetTopProducts", [tenant], ['Product', 'TotalSales', 'TotalUnits']);

  const productNames = result.map((item) => item.Product);
  const totalSales = result.map((item) => Number(item.TotalSales));
  const totalUnits = result.map((item) => Number(item.TotalUnits));

  return {
      productNames,
      totalSales,
      totalUnits,
  };

}

export async function getDiscountsPerformance(prisma, tenant){

  const result = await ExecuteSP(prisma, "sp_GetDiscountsPerformance", [tenant], ['Discount', 'TotalSales', 'TotalUnits']);

  const discountNames = result.map((item) => item.Discount);
  const totalSales = result.map((item) => Number(item.TotalSales));
  const totalUnits = result.map((item) => Number(item.TotalUnits));
  
  return {
    discountNames,
    totalSales,
    totalUnits,
  };

}

export async function updateActivityDashboardLayout(prisma, newLayout, tenant) {
  
  if (!tenant) 
    throw new Error("Tenant is required to update dashboard layout");

  const result = await ExecuteSP(prisma, "sp_UpdActivityDashboardLayout", [tenant, newLayout]);

  return result;

}
