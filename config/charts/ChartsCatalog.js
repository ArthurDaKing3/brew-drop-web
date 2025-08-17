// Service Imports
import { 
    getDailySales,
    getMonthlySales,
    getSalesGrowth,
    getMonthlySalesByCategory,
    getTopProducts, 
    getDiscountsPerformance,
} from "@/services/activityService";

// Config
import { dailySalesOptions, formatDailySalesData } from "@/config/charts/dailySales";
import { monthlySalesOptions, formatMonthlySalesData } from "@/config/charts/monthlySales";
import { salesGrowthOptions, formatSalesGrowthData } from "@/config/charts/salesGrowth";
import { topProductsOptions, formatTopProductsData } from "@/config/charts/topProducts";
import { salesByCategoryOptions, formatSalesByCategoryData } from "@/config/charts/salesByCategory";
import { discountsPerformanceOptions, formatDiscountsPerformanceData } from "@/config/charts/discountsPerformance";

// Components
import DailySalesChart from "@/components/charts/DailySalesChart";
import MonthlySalesChart from "@/components/charts/MonthlySalesChart";
import DiscountsPerformanceChart from "@/components/charts/DiscountsPerformanceChart";
import MonthlySalesByCategoryChart from "@/components/charts/MonthlySalesByCategoryChart";
import TopSoldProductsChart from "@/components/charts/TopSoldProductsChart";
import SalesGrowthChart from "@/components/charts/SalesGrowthChart";

// Icons
import { faTag, faTrophy, faChartPie, faChartLine, faChartSimple, faGaugeHigh } from '@fortawesome/free-solid-svg-icons'



const ChartsCatalog = [
    {
        chartId: 1,
        chartName: "dailySales",
        chartDisplayName: "Ventas Diarias",
        chartIcon: faChartSimple,
        chartComponent: DailySalesChart,
        chartOptions: dailySalesOptions,
        serviceFunction: getDailySales,
        formatData: formatDailySalesData,
    },
    {
        chartId: 2,
        chartName: "salesGrowth",
        chartDisplayName: "Crecimiento de Ventas",
        chartIcon: faChartLine,
        chartComponent: SalesGrowthChart,
        chartOptions: salesGrowthOptions,
        serviceFunction: getSalesGrowth,
        formatData: formatSalesGrowthData,
    },
    {
        chartId: 3,
        chartName: "topProducts",
        chartDisplayName: "Productos Más Vendidos",
        chartIcon: faTrophy,
        chartComponent: TopSoldProductsChart,
        chartOptions: topProductsOptions,
        serviceFunction: getTopProducts,
        formatData: formatTopProductsData,
    },
    {
        chartId: 4,
        chartName: "monthlySales",
        chartDisplayName: "Ventas Mensuales",
        chartIcon: faGaugeHigh,
        chartComponent: MonthlySalesChart,
        chartOptions: monthlySalesOptions,
        serviceFunction: getMonthlySales,
        formatData: formatMonthlySalesData,
    },
    {
        chartId: 5,
        chartName: "monthlySalesByCategory",
        chartDisplayName: "Ventas Mensuales por Categoría",
        chartIcon: faChartPie,
        chartComponent: MonthlySalesByCategoryChart,
        chartOptions: salesByCategoryOptions,
        serviceFunction: getMonthlySalesByCategory,
        formatData: formatSalesByCategoryData,
    },
    {
        chartId: 6,
        chartName: "discountsPerformance",
        chartDisplayName: "Desempeño de Descuentos",
        chartIcon: faTag,
        chartComponent: DiscountsPerformanceChart,
        chartOptions: discountsPerformanceOptions,
        serviceFunction: getDiscountsPerformance,
        formatData: formatDiscountsPerformanceData,
    },
    
];

export default ChartsCatalog;