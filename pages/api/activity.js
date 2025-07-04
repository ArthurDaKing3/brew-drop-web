import { getDailySales, getMonthlySales } from "@/services/activityService";

export default async function handler(req, res) {

  try {

    const dailySales = await getDailySales();
    const {monthlySales, monthlyUnitsSaled} = await getMonthlySales();

    const data = {
      dailySales: {...dailySales},
      monthlySales: monthlySales, 
      monthlyUnitsSaled: monthlyUnitsSaled,
      monthlySalesGoal: 10000, 
      monthlyUnitsGoal: 500,
    };

    res.status(200).json(data);

  } catch (error) {

    console.error("API Error:", error);
    res.status(500).json({ error: "Error al obtener datos de ventas" });

  }

}
