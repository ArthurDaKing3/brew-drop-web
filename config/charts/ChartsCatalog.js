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


const ChartsCatalog = {
    dailySales:  {
        component: DailySalesChart,
        serviceFunction: getDailySales,
        formatData: formatDailySalesData,
        options: dailySalesOptions,
    },
    salesGrowth: {
        component: SalesGrowthChart,
        serviceFunction: getSalesGrowth,
        formatData: formatSalesGrowthData,
        options: salesGrowthOptions,
    },
    topProducts: {
        component: TopSoldProductsChart,
        serviceFunction: getTopProducts,
        formatData: formatTopProductsData,
        options: topProductsOptions,
    },
    monthlySales: {
        component: MonthlySalesChart,
        serviceFunction: getMonthlySales,
        formatData: formatMonthlySalesData,
        options: monthlySalesOptions,
    },
    monthlySalesByCategory: {
        component: MonthlySalesByCategoryChart,
        serviceFunction: getMonthlySalesByCategory,
        formatData: formatSalesByCategoryData,
        options: salesByCategoryOptions,
    },
    discountsPerformance: {
        component: DiscountsPerformanceChart,
        serviceFunction: getDiscountsPerformance,
        formatData: formatDiscountsPerformanceData,
        options: discountsPerformanceOptions,
    },
    
};

export default ChartsCatalog;