import { PrismaClient } from "@prisma/client";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";

const prisma = new PrismaClient({
    log: ['info', 'warn', 'error']
});

export async function getDailySales(date = new Date()) {

  const sales = await prisma.$queryRaw 
  `
        SELECT 
          HOUR(SM.createdAt) AS hour,
          SUM(total)         AS total,
          SUM(quantity)      AS quantity
        FROM 
          SaleMaster AS SM
        INNER JOIN 
          SaleDetail AS SD
            ON SM.id = SD.saleMasterId
        WHERE 
          DATE(SM.createdAt) = ${date.toISOString().split("T")[0]}
        GROUP BY 
          HOUR(SM.createdAt)
    `;

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

export async function getMonthlySales(date = new Date()) {

  const monthStart = startOfMonth(date).toISOString();
  const monthEnd = endOfMonth(date).toISOString();
  
  const sales = await getSalesByMonth(monthStart, monthEnd);

  const monthlySales = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
  const monthlyUnitsSold = sales.reduce((sum, sale) => sum + Number(sale.quantity), 0);
  const monthlySalesGoal = 10000; 
  const monthlyUnitsGoal = 500;

  return { monthlySales, monthlyUnitsSold, monthlySalesGoal, monthlyUnitsGoal};

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
  const sales =  await prisma.$queryRaw
  `
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
    `;

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

    return await prisma.$queryRaw
    `
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
          ${startDate}
        AND 
          ${endDate}
        GROUP BY 
          MONTH(SM.createdAt)
    `;

}

export async function getTopProducts() {

  const result = await prisma.$queryRaw
  `
      SELECT
          D.name 		    AS Product
        , SUM(D.price)	AS TotalSales
        , SUM(quantity) AS TotalUnits
      FROM 
        SaleDetail 	AS SD
      INNER JOIN 	
        Drink 		  AS D
          ON SD.drinkId = D.id
      GROUP BY 
        D.name
      ORDER BY 
        TotalSales DESC
      LIMIT 4
    `;

    const productNames = result.map((item) => item.Product);
    const totalSales = result.map((item) => Number(item.TotalSales));
    const totalUnits = result.map((item) => Number(item.TotalUnits));

    return {
        productNames,
        totalSales,
        totalUnits,
    };

}

export async function getDiscountsPerformance(){
  
  const result = await prisma.$queryRaw
  `
    WITH CTE_DetailsCount AS 
    (
      SELECT 
         saleMasterId
        ,SUM(quantity) AS Quantity
      FROM 
        SaleDetail
      GROUP BY 
        saleMasterId
    )
    SELECT 
       CONCAT(D.description, ' (', D.percentage, '%)')		AS Discount
      ,SUM(SM.total)		AS TotalSales
      ,SUM(DC.Quantity)	AS TotalUnits
    FROM  
      SaleMaster 			AS SM
    INNER JOIN 
      Discount 			AS D
        ON SM.discountId = D.id
    INNER JOIN 	
      CTE_DetailsCount 	AS DC
        ON SM.id = DC.saleMasterId
    GROUP BY 
      D.description

    `;

  const discountNames = result.map((item) => item.Discount);
  const totalSales = result.map((item) => Number(item.TotalSales));
  const totalUnits = result.map((item) => Number(item.TotalUnits));
  
  return {
    discountNames,
    totalSales,
    totalUnits,
  };

}
