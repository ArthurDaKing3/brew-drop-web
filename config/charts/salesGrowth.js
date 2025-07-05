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

export function getSalesGrowthData(data, mode) {
    return{
        labels: data.dates,
        datasets: [
            {
                label: mode == "Dinero" ? "Ventas ($)" : "Unidades Vendidas",
                data: mode == "Dinero" ? data.sales : data.units,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                tension: 0.3,
                fill: true,
            },
        ],
    }
}                            