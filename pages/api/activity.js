import { getDailySales, getMonthlySales, getSalesGrowth, getMonthlySalesByCategory } from "@/services/activityService";

export default async function handler(req, res) {

  try {

    const [dailySales, monthlySales, salesGrowth, salesByCategory] = await Promise.all([

      getDailySales(),
      getMonthlySales(),  
      getSalesGrowth(), 
      getMonthlySalesByCategory(),
    
    ]);

    const data = {
      dailySales: {...dailySales},
      salesGrowth: {...salesGrowth},
      monthlySales: 
        { 
          ...monthlySales,
          monthlySalesGoal: 10000, 
          monthlyUnitsGoal: 500,
        },
      monthlySalesByCategory: {
        categories: salesByCategory.categories,
        totalSales: salesByCategory.totalSales,
        totalUnits: salesByCategory.totalUnits,
      }
    };

    res.status(200).json(data);

  } catch (error) {

    console.error("API Error:", error);
    res.status(500).json({ error: "Error al obtener datos de ventas" });

  }

}
