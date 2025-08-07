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
import useAPIData       from "@/hooks/useAPIData";

// Components
import Layout           from "../components/Layout";
import ChartSkeleton    from "../components/ChartSkeleton";
import ErrorAlert       from "../components/ErrorAlert";

// Catalog
import ChartsCatalog    from "@/config/charts/ChartsCatalog";

// Configuration
import { getConfigForTenant } from "@/services/configurationService";


export async function getServerSideProps({ req }) {

    const host = req.headers.host;
    const tenant = host?.split('.')[0] || 'default';

    try {
        const config = await getConfigForTenant(tenant);
        return {props: { config }};
    } 
    catch (error) {
        return {props: { config: {error: error.message} }};
    }   

}

const activity = ({ config }) => {
    
    if(config.error) return ErrorAlert({ message: config.error });
    console.log("Tenant Config Loaded: ", config);

    const ActivityDashboardLayout = config.ActivityDashboardLayout;
    const { data, loading, error } = useAPIData("/api/activity");
    
    if (error) return ErrorAlert({ message: error });

    return(
        <div>
            <Layout 
                CurrentPage = {"Activity"}
                SalesActivity = {
                    <div className="activity-wrapper">
                        {
                            ActivityDashboardLayout.find(s => s.SectionLabel == "Ventas").SectionCharts.map((chartName) => {
                                
                                if(loading) return <ChartSkeleton key={chartName} />;

                                const ChartComponent = ChartsCatalog[chartName].component;
                                const chartData = data[chartName]?.chartData;
                                const chartOptions = data[chartName]?.chartOptions;

                                return(
                                    <ChartComponent
                                        key={chartName}
                                        data={chartData}
                                        options={chartOptions}
                                    />
                                );
                            })

                        }
                    </div>
                }
                ProductsActivity={
                    <div className="activity-wrapper">
                        {
                            ActivityDashboardLayout.find(s => s.SectionLabel == "Productos").SectionCharts.map((chartName) => {
                                
                                if(loading) return <ChartSkeleton key={chartName} />;

                                const ChartComponent = ChartsCatalog[chartName].component;
                                const chartData = data[chartName]?.chartData;
                                const chartOptions = data[chartName]?.chartOptions;

                                return(
                                    <ChartComponent
                                        key={chartName}
                                        data={chartData}
                                        options={chartOptions}
                                    />
                                );
                            })

                        }
                    </div>
                }
                DiscountsActivity={
                    <div className="activity-wrapper">
                        {
                            ActivityDashboardLayout.find(s => s.SectionLabel == "Descuentos").SectionCharts.map((chartName) => {
                                
                                if(loading) return <ChartSkeleton key={chartName} />;

                                const ChartComponent = ChartsCatalog[chartName].component;
                                const chartData = data[chartName]?.chartData;
                                const chartOptions = data[chartName]?.chartOptions;

                                return(
                                    <ChartComponent
                                        key={chartName}
                                        data={chartData}
                                        options={chartOptions}
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