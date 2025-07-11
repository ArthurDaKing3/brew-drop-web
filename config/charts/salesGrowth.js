export const salesGrowthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: 'Crecimiento de Ventas',
        }
    }
};

export function getSalesGrowthData(salesGrowth) {
    return(
        {
            DataBySales: {
                labels: salesGrowth.dates,
                datasets: [
                    {
                        label:  "Ventas ($)",
                        data: salesGrowth.sales,
                        borderColor: "rgba(54, 162, 235, 1)",
                        backgroundColor: "rgba(54, 162, 235, 0.5)",
                        tension: 0.3,
                        fill: true,
                    },
                ],
            },
            DataByUnits:{
                labels: salesGrowth.dates,
                datasets: [
                    {
                        label: "Unidades Vendidas",
                        data: salesGrowth.units,
                        borderColor: "rgba(54, 162, 235, 1)",
                        backgroundColor: "rgba(54, 162, 235, 0.5)",
                        tension: 0.3,
                        fill: true,
                    },
                ],
            }

        }
    );
}                            