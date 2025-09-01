import ChartsCatalog from "@/config/charts/ChartsCatalog";
import { PrismaClient } from "@prisma/client";
import { updateActivityDashboardLayout } from "@/services/activityService";
import { getTenantFromRequest } from "@/utils/utilites";

const prismaConnection = new PrismaClient({
    log: ['info', 'warn', 'error']
});

export default async function handler(req, res) {

  const tenant = getTenantFromRequest(req);

  switch(req.method){

    case "POST":
      const currentLayout  = req.body.currentLayout;
      const selectedCharts = currentLayout.flatMap(section => section.SectionCharts);

      await getActivityData(tenant, selectedCharts);
      break;

    case "PUT":
      await updateDashboardLayout(req.body, tenant);
      break;

    default:
        res.status(405).end(`Method ${req.method} Not Allowed`);
      break;

  }

  async function getActivityData(tenant, selectedCharts){
    try {
      
      const resultEntries = await Promise.all(
        selectedCharts.map(async (chart) => {

            const chartCatalog = ChartsCatalog.find(c => c.chartName == chart);

            const getChartInformation = chartCatalog.serviceFunction;
            if (!getChartInformation) return [chartCatalog.chartName, null];

            const rawInformation = await getChartInformation(prismaConnection, tenant);
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

  async function updateDashboardLayout(newLayout, tenant){

    try{
      const result = await updateActivityDashboardLayout(prismaConnection, newLayout, tenant);

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
