import ChartsCatalog from "@/config/charts/ChartsCatalog";

export default async function handler(req, res) {

  // Placeholder, this will be replaced with database info 
  const ActivityDashboardLayout = [
    "dailySales",
    "salesGrowth",
    "topProducts",
    "monthlySales",
    "discountsPerformance",
    "monthlySalesByCategory",
  ]

  try {
    const resultEntries = await Promise.all(
      ActivityDashboardLayout.map(async (chart) => {

          const getChartInformation = ChartsCatalog[chart].serviceFunction;
          if (!getChartInformation) return [chart, null];

          const rawInformation = await getChartInformation();
          const formattedData = ChartsCatalog[chart].formatData(rawInformation);
          
          const result = {
            chartName: chart,
            chartOptions: ChartsCatalog[chart].options,
            chartData: formattedData,
          };

          return [chart, result];

        })
    );
    
    const data = Object.fromEntries(resultEntries);
    res.status(200).json(data);

  } catch (error) {

    console.error("API Error:", error);
    res.status(500).json({ message: `API Error: ${error.message}` });

  }

}
