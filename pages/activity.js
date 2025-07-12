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
import { dailySalesOptions, formatDailySalesData } from "@/config/charts/dailySales";
import { monthlySalesOptions, formatMonthlySalesData } from "@/config/charts/monthlySales";
import { salesGrowthOptions, formatSalesGrowthData } from "@/config/charts/salesGrowth";
import { topProductsOptions, formatTopProductsData } from "@/config/charts/topProducts";
import { salesByCategoryOptions } from "@/config/charts/salesByCategory";

// Hooks
import useAPIData from "@/hooks/useAPIData";

// Components
import Layout from "../components/Layout";
import ChartSkeleton from "../components/ChartSkeleton";
import ErrorAlert from "../components/ErrorAlert";
import DailySalesChart from "../components/charts/DailySalesChart";
import MonthlySalesChart from "../components/charts/MonthlySalesChart";
import SalesGrowthChart from "../components/charts/SalesGrowthChart";
import MonthlySalesByCategoryChart from "../components/charts/MonthlySalesByCategoryChart";
import TopSoldProducts from "../components/charts/TopSoldProducts";


// const chartsCatalog = [
//     {
//         name: "Ventas Diarias",
//         component: DailySalesChart,
//         data: formatDailySalesData,
//         options: dailySalesOptions,
//     },
//     {
//         name: "Ventas Mensuales",
//         component: MonthlySalesChart,
//         data: formatMonthlySalesData,
//         options: monthlySalesOptions,
//     },
//     {
//         name: "Crecimiento de Ventas",
//         component: SalesGrowthChart,
//         data: formatSalesGrowthData,
//         options: salesGrowthOptions,
//     },
//     {
//         name: "Ventas por Categoría",
//         component: MonthlySalesByCategoryChart,
//         data: null, 
//         options: salesByCategoryOptions,
//     },
//     {
//         name: "Productos Más Vendidos",
//         component: TopSoldProducts,
//         data: formatTopProductsData,
//         options: topProductsOptions,
//     }
// ]


const activity = () => {

    const { data, loading, error } = useAPIData("/api/activity");
    
    let dailySalesData      = {};
    let monthlySalesData    = {};
    let salesGrowthData     = {};
    let salesByCategoryData = {};
    let topProductsData     = {};
    
    if(!loading && !error) {

        dailySalesData      = formatDailySalesData(data.dailySales);
        monthlySalesData    = formatMonthlySalesData(data.monthlySales);
        salesGrowthData     = formatSalesGrowthData(data.salesGrowth);
        salesByCategoryData = data.monthlySalesByCategory;
        topProductsData     = formatTopProductsData(data.topProducts);

    }
    
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
                    error 
                    ? ErrorAlert({ message: error }) 
                    :
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
                    error 
                    ? ErrorAlert({ message: error }) 
                    :
                    <div className="activity-wrapper">
                        
                        {/* Productos mas vendidos */}
                        {
                                loading
                                ?
                                    <ChartSkeleton />
                                :
                                    <TopSoldProducts
                                        topProductsData    = {topProductsData}
                                        topProductsOptions = {topProductsOptions} />
                        }
                    </div>
                }

                DiscountsActivity={
                    error 
                    ? ErrorAlert({ message: error }) 
                    :
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