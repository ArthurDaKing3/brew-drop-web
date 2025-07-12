export const topProductsOptions = {
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

export function formatTopProductsData(topProductsData) {
    return(
        {
            DataBySales: {
                labels: topProductsData.productNames,
                datasets: [
                {
                    label: "Ventas ($)",
                    data: topProductsData.totalSales,
                    backgroundColor: "rgba(153, 102, 255, 0.5)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 1,
                },
                ],
            },
            DataByUnits:{
                labels: topProductsData.productNames,
                datasets: [
                {
                    label: "Unidades Vendidas",
                    data: topProductsData.totalUnits,
                    backgroundColor: "rgba(153, 102, 255, 0.5)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 1,
                },
                ],
            }
        }
    );
}