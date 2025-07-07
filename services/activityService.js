import { startOfDay, endOfDay } from "date-fns";
import { PrismaClient } from "@prisma/client";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";


const prisma = new PrismaClient({
    log: ['info', 'warn', 'error']
});

// CHANGE DAILY SALES UNITS TO BE REAL UNITS NOT COUNT OF SALES
export async function getDailySales(date = new Date()) {

  const sales = await prisma.$queryRawUnsafe(`
        SELECT 
          HOUR(SM.createdAt) AS hour,
          SUM(total) AS total,
          SUM(quantity) AS quantity
        FROM 
          SaleMaster AS SM
        INNER JOIN 
          SaleDetail AS SD
            ON SM.id = SD.saleMasterId
        WHERE 
          DATE(SM.createdAt) = "${date.toISOString().split("T")[0]}"
        GROUP BY 
          HOUR(SM.createdAt)
    `);

  const hours = sales.map((sale) => {
    const hour = sale.hour;
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

export async function getMonthlySales(date = new Date()) {

  const monthStart = startOfMonth(date).toISOString();
  const monthEnd = endOfMonth(date).toISOString();
  
  const sales = await getSalesByMonth(monthStart, monthEnd);

  const monthlySales = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
  const monthlyUnitsSaled = sales.reduce((sum, sale) => sum + Number(sale.quantity), 0);

  return { monthlySales, monthlyUnitsSaled };

}

export async function getSalesGrowth() {
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
    
    const result = await getSalesByMonth(month.start.toISOString(), month.end.toISOString());

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

export async function getMonthlySalesByCategory(){
  const sales =  await prisma.$queryRawUnsafe(`
        SELECT 
          C.\`name\` 			  AS category
          ,SUM(SM.total)		AS total
          ,SUM(SD.quantity)	AS quantity
        FROM  
          SaleMaster 			  AS SM
        INNER JOIN 
          SaleDetail 			  AS SD
            ON SM.id = SD.saleMasterId
        INNER JOIN 
          Drink 				    AS D
            ON SD.drinkId = D.id
        INNER JOIN 
          _CategoryToDrink 	AS CTD
                ON D.id = CTD.B
        INNER JOIN 
          Category 			    AS C
            ON CTD.A = C.id
        WHERE 
          MONTH(SM.createdAt) = MONTH(NOW())
        GROUP BY 
          C.\`name\`
    `);

    const categories = sales.map((sale) => sale.category);
    const totalSales = sales.map((sale) => sale.total);
    const totalUnits = sales.map((sale) => sale.quantity);

    return {
        categories,
        totalSales,
        totalUnits,
    };
}

async function getSalesByMonth(startDate, endDate) {

    return await prisma.$queryRawUnsafe(`
        SELECT 
          MONTH(SM.createdAt) AS month,
          SUM(total)          AS total,
          SUM(quantity)       AS quantity
        FROM 
          SaleMaster	AS SM
        INNER JOIN 
          SaleDetail  AS SD
            ON SM.id = SD.saleMasterId
        WHERE 
          SM.createdAt 
        BETWEEN 
          "${startDate}"
        AND 
          "${endDate}"
        GROUP BY 
          MONTH(SM.createdAt)
    `);

}

