// Dependencies
import { React, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  ArcElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

// Hooks
import useAPIData               from "@/hooks/useAPIData";

// Components
import Layout                   from "../components/Layout";
import ChartSkeleton            from "../components/ChartSkeleton";
import ErrorAlert               from "../components/ErrorAlert";
import CustomizeDashboardButton from "@/components/CustomizeDashboardButton";

// Catalog
import ChartsCatalog            from "@/config/charts/ChartsCatalog";

// Configuration
import { getConfigForTenant }   from "@/services/configurationService";

// Context
import { ChartContext }         from "@/context/ChartContext";
import { TenantContext }        from "@/context/TenantContext";

// Utilities
import { getTenantFromRequest } from "@/utils/utilites.js";

export async function getServerSideProps({ req }) {

    const tenant = getTenantFromRequest(req);

    try {
        const config = await getConfigForTenant(tenant);
        return {props: { tenant, config }};
    } 
    catch (error) {
        return {props: { config: {error: error.message} }};
    }   

}

const activity = ({ tenant, config }) => {

    if(config.error) return ErrorAlert({ message: "Failed to load tenant configuration", details: config.error });
    console.log(`Config Loaded for ${tenant}: `, config);

    const ActivityDashboardLayout = config.ActivityDashboardLayout;
    const { data, loading, error } = useAPIData("/api/activity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentLayout: ActivityDashboardLayout }) });

    if (error) return ErrorAlert({ message: "Failed to load activity data", details: error });

    return(
        <div>
            <Layout 
                CurrentPage = {"Activity"}
                SalesActivity = {
                    <div className="activity-wrapper">
                        
                        <ChartContext.Provider value={{ dashboardLayout: ActivityDashboardLayout, currentSection: "Ventas" }}>
                            <CustomizeDashboardButton />
                        </ChartContext.Provider>

                        {
                            ActivityDashboardLayout.find(s => s.SectionLabel == "Ventas").SectionCharts.map((chartName) => {
                                
                                if(loading) return <ChartSkeleton key={chartName} />;

                                const chart = ChartsCatalog.find(c => c.chartName == chartName);
                                const ChartComponent = chart.chartComponent;
                                chart.chartData =  data[chartName]?.chartData;

                                return(
                                    <ChartComponent
                                        key={chartName}
                                        data={chart.chartData}
                                        options={chart.chartOptions}
                                    />
                                );
                            })

                        }
                    </div>
                }
                ProductsActivity={
                    <div className="activity-wrapper">

                        <ChartContext.Provider value={{ dashboardLayout: ActivityDashboardLayout, currentSection: "Productos"  }}>
                            <CustomizeDashboardButton />
                        </ChartContext.Provider>

                        {
                            ActivityDashboardLayout.find(s => s.SectionLabel == "Productos").SectionCharts.map((chartName) => {

                                if(loading) return <ChartSkeleton key={chartName} />;

                                const chart = ChartsCatalog.find(c => c.chartName == chartName);
                                const ChartComponent = chart.chartComponent;
                                chart.chartData =  data[chartName]?.chartData;

                                return(
                                    <ChartComponent
                                        key={chartName}
                                        data={chart.chartData}
                                        options={chart.chartOptions}
                                    />
                                );

                            })

                        }
                    </div>
                }
                DiscountsActivity={
                    <div className="activity-wrapper">

                        <ChartContext.Provider value={{ dashboardLayout: ActivityDashboardLayout, currentSection: "Descuentos" }}>
                            <CustomizeDashboardButton />
                        </ChartContext.Provider>

                        {
                            ActivityDashboardLayout.find(s => s.SectionLabel == "Descuentos").SectionCharts.map((chartName) => {
                                
                                if(loading) return <ChartSkeleton key={chartName} />;

                                const chart = ChartsCatalog.find(c => c.chartName == chartName);
                                const ChartComponent = chart.chartComponent;
                                chart.chartData =  data[chartName]?.chartData;

                                return(
                                    <ChartComponent
                                        key={chartName}
                                        data={chart.chartData}
                                        options={chart.chartOptions}
                                    />
                                );
                            })

                        }
                    </div>
                }
            />
        </div>
    );
}

export default activity;