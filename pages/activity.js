// Dependencies
import { React } from "react";
import { Bar } from "react-chartjs-2";
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

// Config
import { dailySalesOptions, getDailySalesData } from "@/config/charts/dailySales";
import { monthlySalesOptions, getMonthlySalesData } from "@/config/charts/monthlySales";
import { salesGrowthOptions, getSalesGrowthData } from "@/config/charts/salesGrowth";
import { salesByCategoryOptions } from "@/config/charts/salesByCategory";

// Hooks
import useAPIData from "@/hooks/useAPIData";

// Components
import Layout from "../components/Layout";
import ChartSkeleton from "../components/ChartSkeleton";
import DailySalesChart from "../components/charts/DailySalesChart";
import MonthlySalesChart from "../components/charts/MonthlySalesChart";
import SalesGrowthChart from "../components/charts/SalesGrowthChart";
import MonthlySalesByCategoryChart from "../components/charts/MonthlySalesByCategoryChart";



const activity = () => {

    const { data, loading, error } = useAPIData("/api/activity");
        
    let dailySalesData      = {};
    let monthlySalesData    = {};
    let salesGrowthData     = {};
    let salesByCategoryData = {};
    
    if(!loading){

        dailySalesData      = getDailySalesData(data.dailySales);
        monthlySalesData    = getMonthlySalesData(data.monthlySales);
        salesGrowthData     = getSalesGrowthData(data.salesGrowth);
        salesByCategoryData = data.monthlySalesByCategory;

    }

    const topProducts = {
        names: ["Producto A", "Producto B", "Producto C"],
        sales: [500, 400, 300],
    };
    const topProductsOptions = {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Productos mas vendidos'
            }
        }
    };

    
    const promotionPerformance = {
        names: ["Promo 1", "Promo 2"],
        sales: [1500, 1200],
    };
    const promotionPerformanceOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Desempeño de Descuentos'
            }
        }
    };

    return(
        <div>
            <Layout 
                CurrentPage = {"Activity"}
                SalesActivity = {
                    <div className="activity-wrapper">
                        
                        {/* Ventas Diarias */}
                        {
                            loading 
                            ?
                                <ChartSkeleton />
                            :
                                <DailySalesChart 
                                    dailySalesData     = {dailySalesData}
                                    dailySalesOptions  = {dailySalesOptions}
                                />
                        }
                        {/* Ventas Mensaules */}
                        <div>
                            {
                            loading 
                            ?
                                <ChartSkeleton />
                            :
                                <MonthlySalesChart 
                                    monthlySalesData    = {monthlySalesData}
                                    monthlySalesOptions = {monthlySalesOptions}
                                    monthlySalesLabels  = {data.monthlySales}
                                />
                            }
                        </div>

                        {/* Crecimiento de Ventas */}
                        {
                            loading 
                            ?
                                <ChartSkeleton />
                            :
                                <SalesGrowthChart
                                    salesGrowthData     = {salesGrowthData}
                                    salesGrowthOptions  = {salesGrowthOptions}
                                />
                        }

                        {/* Ventas por Categoría */}
                        {
                            loading
                            ?
                                <ChartSkeleton />
                            :
                                <MonthlySalesByCategoryChart
                                    salesByCategoryData     = {salesByCategoryData}
                                    salesByCategoryOptions  = {salesByCategoryOptions}
                                />
                        }
                    </div>
                }

                ProductsActivity={
                    <div className="activity-wrapper">
                        {/* Productos Más Vendidos */}
                        <div className="chart-container">
                            <Bar
                                data={{
                                    labels: topProducts.names,
                                    datasets: [
                                    {
                                        label: "Ventas",
                                        data: topProducts.sales,
                                        backgroundColor: "rgba(153, 102, 255, 0.5)",
                                        borderColor: "rgba(153, 102, 255, 1)",
                                        borderWidth: 1,
                                    },
                                    ],
                                }}
                                options={topProductsOptions}
                            />
                        </div>
                    </div>
                }

                DiscountsActivity={
                    <div className="activity-wrapper">
                        {/* Desempeño de Promociones */}
                        <div className="chart-container">
                            <Bar
                                data={{
                                    labels: promotionPerformance.names,
                                    datasets: [
                                    {
                                        label: "Ventas",
                                        data: promotionPerformance.sales,
                                        backgroundColor: "rgba(255, 159, 64, 0.5)",
                                        borderColor: "rgba(255, 159, 64, 1)",
                                        borderWidth: 1,
                                    },
                                    ],
                                }}
                                options={promotionPerformanceOptions}
                            />
                        </div>
                    </div>
                }
            />
            
        </div>
    );
}

export default activity;