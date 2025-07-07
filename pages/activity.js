// Dependencies
import { React, useEffect, useState } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
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

// Config
import { dailySalesOptions, getDailySalesData } from "@/config/charts/dailySales";
import { monthlySalesOptions, getMonthlySalesData } from "@/config/charts/monthlySales";
import { salesGrowthOptions, getSalesGrowthData } from "@/config/charts/salesGrowth";
import { salesByCategoryOptions } from "@/config/charts/salesByCategory";

// Hooks
import useActivityData from "@/hooks/useActivityData";

// Components
import Layout from "../components/Layout";
import ToggleChartViewMode from "../components/ToggleChartViewMode";
import ChartSkeleton from "../components/ChartSkeleton";

// Utilities
import { formatCurrency } from "@/utils/utilites";

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

const activity = () => {

    const { data, loading, error } = useActivityData();
    console.log(data);

    const [dailySalesMode,      setDailySalesMode]      = useState("Dinero"); 
    const [monthlySalesMode,    setMonthlySalesMode]    = useState("Dinero");
    const [salesGrowthMode,     setSalesGrowthMode]     = useState("Dinero");
    const [salesByCategoryMode, setSalesByCategoryMode] = useState("Dinero");
    
    let dailySales          = {};
    let monthlySalesData    = {};
    let salesGrowthData     = {};
    let salesByCategoryData = {};
    
    if(!loading){

        dailySales          = getDailySalesData(data.dailySales, dailySalesMode);
        monthlySalesData    = getMonthlySalesData({...data.monthlySales}, monthlySalesMode);
        salesGrowthData     = getSalesGrowthData(data.salesGrowth, salesGrowthMode);
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
                                <div className="chart-container" >
                                    <Bar
                                        data = {dailySales}
                                        options = {dailySalesOptions}
                                    />
                                    
                                    <ToggleChartViewMode handler={setDailySalesMode} viewMode={dailySalesMode} />
                                    
                                </div>
                        }
                        {/* Ventas Mensaules */}
                        <div>
                            {
                            loading 
                            ?
                                <ChartSkeleton />
                            :

                                <div className="chart-container">
                                    <Doughnut data={monthlySalesData} options={monthlySalesOptions} />
                                
                                    <div style={{ textAlign: "center", marginTop: "-110px", fontSize: "15px" }}>
                                        <strong>{monthlySalesMode == "Dinero" ? `${formatCurrency(data.monthlySales.monthlySales)} / ${formatCurrency(data.monthlySales.monthlySalesGoal)}` : `${data.monthlySales.monthlyUnitsSaled} / ${data.monthlySales.monthlyUnitsGoal}`}</strong>
                                        <p>{monthlySalesMode == "Dinero" ? "Ventas mensuales" : "Unidades Vendidas"}</p>
                                    </div>

                                    <div style={{ position: "absolute", bottom: "-40px" }}>
                                        <ToggleChartViewMode handler={setMonthlySalesMode} viewMode={monthlySalesMode}/>
                                    </div>
                                </div>
                            }
                        </div>

                        {/* Crecimiento de Ventas */}
                        {
                            loading 
                            ?
                                <ChartSkeleton />
                            :
                            <div className="chart-container">

                                <Line  data={salesGrowthData} options={salesGrowthOptions} />
                                <ToggleChartViewMode handler={setSalesGrowthMode} viewMode={salesGrowthMode}/>
                    
                            </div>
                        }

                        {/* Ventas por Categoría */}
                        {
                            loading
                            ?
                                <ChartSkeleton />
                            :
                                <div className="chart-container">
                                    <Pie
                                        data={{
                                            labels: salesByCategoryData.categories,
                                            datasets: [
                                            {
                                                label: salesByCategoryMode == "Dinero" ? "Ventas ($)" : "Unidades Vendidas",
                                                data: salesByCategoryMode == "Dinero" ? salesByCategoryData.totalSales : salesByCategoryData.totalUnits,
                                                backgroundColor: [
                                                    "rgba(255, 99, 132, 0.5)",
                                                    "rgba(54, 162, 235, 0.5)",
                                                    "rgba(255, 206, 86, 0.5)",
                                                    "rgba(75, 192, 192, 0.5)",
                                                ],
                                                borderColor: [
                                                    "rgba(255, 99, 132, 1)",
                                                    "rgba(54, 162, 235, 1)",
                                                    "rgba(255, 206, 86, 1)",
                                                    "rgba(75, 192, 192, 1)",
                                                ],
                                                borderWidth: 1,
                                            },
                                            ],
                                        }}
                                        options={salesByCategoryOptions}
                                    />
                                    <ToggleChartViewMode handler={setSalesByCategoryMode} viewMode={salesByCategoryMode} />
                                </div>

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