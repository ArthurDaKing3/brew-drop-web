import { getDailySales, getMonthlySales, getSalesGrowth } from "@/services/activityService";

export default async function handler(req, res) {

  try {

    const [dailySales, monthlySales, salesGrowth] = await Promise.all([

      getDailySales(),
      getMonthlySales(),  
      getSalesGrowth(), 
    
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
    };

    res.status(200).json(data);

  } catch (error) {

    console.error("API Error:", error);
    res.status(500).json({ error: "Error al obtener datos de ventas" });

  }

}
