import { 
  getDailySales,
  getMonthlySales,
  getSalesGrowth,
  getMonthlySalesByCategory,
  getTopProducts, 
} from "@/services/activityService";

export default async function handler(req, res) {

  try {

    const [dailySales, monthlySales, salesGrowth, salesByCategory, topProducts] = await Promise.all([

      getDailySales(),
      getMonthlySales(),  
      getSalesGrowth(), 
      getMonthlySalesByCategory(),
      getTopProducts(),
    
    ]);

    const data = {
      dailySales: {...dailySales},
      salesGrowth: {...salesGrowth},
      monthlySales: { 
          ...monthlySales,
          monthlySalesGoal: 10000, 
          monthlyUnitsGoal: 500,
      },
      monthlySalesByCategory: {
        categories: salesByCategory.categories,
        totalSales: salesByCategory.totalSales,
        totalUnits: salesByCategory.totalUnits,
      },
      topProducts: {...topProducts}
    };
    
    res.status(200).json(data);

  } catch (error) {

    console.error("API Error:", error);
    res.status(500).json({ message: `API Error: ${error.message}` });

  }

}
