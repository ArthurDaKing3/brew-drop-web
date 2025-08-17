import ChartsCatalog from "@/config/charts/ChartsCatalog";
import { PrismaClient } from "@prisma/client";
import { updateActivityDashboardLayout } from "@/services/activityService";
const prismaConnection = new PrismaClient({
    log: ['info', 'warn', 'error']
});

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

  switch(req.method){
    case "GET":
      await getActivityData();
      break;

    case "PUT":
      await updateDashboardLayout(req.body);
      break;

    default:
        res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }

  async function getActivityData(){
    try {
      
      const resultEntries = await Promise.all(
        ActivityDashboardLayout.map(async (chart) => {

            const chartCatalog = ChartsCatalog.find(c => c.chartName == chart);

            const getChartInformation = chartCatalog.serviceFunction;
            if (!getChartInformation) return [chartCatalog.chartName, null];

            const rawInformation = await getChartInformation(prismaConnection);
            const formattedData = chartCatalog.formatData(rawInformation);
            
            const result = {
              chartName: chartCatalog.chartName,
              chartOptions: chartCatalog.chartOptions,
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
    finally {

      await prismaConnection.$disconnect();

    }
  }

  async function updateDashboardLayout(newLayout){

    try{
      const result = await updateActivityDashboardLayout(prismaConnection, newLayout);

      res.status(200).json({ message: "Dashboard layout updated successfully" });
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ message: `Failed to update dashboard layout: ${error.message}` });
    }
    finally {
      await prismaConnection.$disconnect();
    }


  }

}
